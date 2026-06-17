<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :href="isLink ? props.link : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :type="!isLink ? props.type : undefined"
    :disabled="disabled || loading"
    class="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-[length:200%_100%] text-center font-semibold text-white shadow-lg transition-all duration-500 ease-out hover:scale-[1.01] hover:bg-right focus:ring-4 focus:ring-blue-400/40 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    :class="[
      sizeClasses[props.size],
      variantClasses[props.variant],
      fullWidth ? 'w-full' : 'w-auto',
      props.customClass,
      loading ? 'cursor-wait' : '',
    ]"
    @click="handleClick"
  >
    <span
      class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
    />
    <svg v-if="loading" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <svg
      v-else-if="iconLeft && !loading"
      class="h-5 w-5 transition-transform group-hover:scale-110"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path :d="icons[iconLeft]" />
    </svg>
    <span class="relative">
      <slot>
        {{ props.title }}
      </slot>
    </span>
    <slot name="lucidicon"> </slot>
    <svg
      v-if="iconRight && !loading"
      class="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:scale-110"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path :d="icons[iconRight]" />
    </svg>
    <span
      v-if="badge"
      class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
    >
      {{ badge }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type IconType =
  | 'arrow-right'
  | 'external-link'
  | 'download'
  | 'check'
  | 'info'
  | 'phone'
  | 'message'
  | 'user'
  | 'arrow-down'

interface Props {
  title?: string
  link?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'red'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  iconLeft?: IconType
  iconRight?: IconType
  loading?: boolean
  disabled?: boolean
  badge?: string | number
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  external?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  fullWidth: true,
  external: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isLink = computed(() => !!props.link)

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-xl',
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 ',
  secondary: 'bg-gradient-to-r from-blue-700 to-gray-800 hover:from-green-800 hover:to-green-900 ',
  outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-none',
  gradient:
    'bg-gradient-to-r from-blue-500  to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 ',
  red: 'bg-gradient-to-r from-blue-500  to-pink-500 hover:from-red-600 hover:yellow-600 hover:to-red-600 ',
}

const icons: Record<IconType, string> = {
  'arrow-right':
    'M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z',
  'external-link':
    'M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z',
  download:
    'M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
  check:
    'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
  info: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
  phone:
    'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z',
  message:
    'M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z',
  user: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
  'arrow-down':
    'M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z',
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
