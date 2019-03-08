// Styles
import './VToolbar.sass'

// Extensions
import VSheet from '../VSheet/VSheet'

// Components
import VImg, { srcObject } from '../VImg/VImg'

// Types
import { VNode } from 'vue'
import { convertToUnit } from '../../util/helpers'
import { PropValidator } from 'vue/types/options'

/* @vue/component */
export default VSheet.extend({
  name: 'v-toolbar',

  props: {
    absolute: Boolean,
    dense: Boolean,
    collapse: Boolean,
    extended: Boolean,
    extensionHeight: {
      default: 48,
      type: [Number, String],
      validator: (v: any) => !isNaN(parseInt(v))
    },
    flat: Boolean,
    floating: Boolean,
    prominent: Boolean,
    short: Boolean,
    src: {
      type: [String, Object],
      default: ''
    } as PropValidator<string | srcObject>,
    tile: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    isExtended: false
  }),

  computed: {
    computedHeight (): number {
      const height = this.computedContentHeight

      return this.isCollapsed
        ? height
        : height + (this.isExtended ? this.extensionHeight : 0)
    },
    computedContentHeight (): number {
      if (this.height) return parseInt(this.height)
      if (this.isProminent && this.dense) return 96
      if (this.isProminent && this.short) return 112
      if (this.isProminent) return 128
      if (this.dense) return 48
      if (this.short || this.$vuetify.breakpoint.smAndDown) return 56
      return 64
    },
    classes (): object {
      return {
        ...VSheet.options.computed.classes.call(this),
        'v-toolbar': true,
        'v-toolbar--absolute': this.absolute,
        'v-toolbar--collapse': this.collapse,
        'v-toolbar--collapsed': this.isCollapsed,
        'v-toolbar--dense': this.dense,
        'v-toolbar--extended': this.isExtended,
        'v-toolbar--floating': this.floating,
        'v-toolbar--prominent': this.isProminent,
        'elevation-0': this.isFlat
      }
    },
    isCollapsed (): boolean {
      return this.collapse
    },
    isProminent (): boolean {
      return this.prominent
    },
    isFlat (): boolean {
      return this.flat
    },
    styles (): object {
      return this.measurableStyles
    }
  },

  methods: {
    genBackground () {
      const props = {
        height: convertToUnit(this.computedHeight),
        src: this.src
      }

      const image = this.$scopedSlots.img
        ? this.$scopedSlots.img({ props })
        : this.$createElement(VImg, { props })

      return this.$createElement('div', {
        staticClass: 'v-toolbar__image'
      }, [image])
    },
    genContent () {
      return this.$createElement('div', {
        staticClass: 'v-toolbar__content',
        style: {
          height: convertToUnit(this.computedContentHeight)
        }
      }, this.$slots.default)
    },
    genExtension () {
      return this.$createElement('div', {
        staticClass: 'v-toolbar__extension',
        style: {
          height: convertToUnit(this.extensionHeight)
        }
      }, this.$slots.extension)
    }
  },

  render (h): VNode {
    this.isExtended = this.extended || !!this.$slots.extension

    const children = [this.genContent()]
    const data = this.setBackgroundColor(this.color, {
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    })

    if (this.isExtended) children.push(this.genExtension())
    if (this.src || this.$scopedSlots.img) children.unshift(this.genBackground())

    return h('nav', data, children)
  }
})
