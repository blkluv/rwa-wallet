<script setup lang="ts">
interface Props {
  isLoading?: boolean;
}
const { isLoading } = defineProps<Props>();
</script>

<template>
  <BsBtnDefault :is-loading="isLoading" class="bg-gray-900 text-white hover:bg-gray-700" v-bind="$attrs">
    <slot />
  </BsBtnDefault>
</template>
