<script setup lang="ts">
interface Props {
  isLoading?: boolean;
}
const { isLoading } = defineProps<Props>();
</script>

<template>
  <button type="button" class="rounded-md font-medium border-0 shadow-sm text-base py-2 px-4 inline-flex justify-center items-center sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed" :class="isLoading ? 'cursor-not-allowed' : 'cursor-pointer'" v-bind="$attrs">
    <div v-show="isLoading" mr-2 i-eos-icons-loading />
    <slot />
  </button>
</template>
