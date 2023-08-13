<script setup lang="ts">
import { iconComponentMap } from "~/constants/icons";

const { nft } = $(nftStore());

const links = $computed(() => get(nft, "token.properties.links", []));
</script>
<template>
  <footer class="bg-white">
    <div class="mx-auto max-w-7xl py-10 px-6 overflow-hidden sm:py-12 lg:px-8">
      <!-- <nav class="-mb-6 sm:flex columns-2 sm:space-x-12 sm:justify-center" aria-label="Footer">
        <div v-for="item in navigation.main" :key="item.name" class="pb-6">
          <a :href="item.href" class="text-sm text-gray-600 leading-6 hover:text-gray-900">{{ item.name }}</a>
        </div>
      </nav> -->
      <div class="flex space-x-10 mt-10 justify-center">
        <a v-for="(item, index) in links" :key="`${item.icon}-${index}`" :href="item.link" class="text-gray-400 hover:text-gray-500" target="_blank">
          <span class="sr-only">{{ item.icon }}</span>
          <component :is="iconComponentMap[item.icon]" class="h-6 w-6" aria-hidden="true" />
        </a>
      </div>
      <p class="mt-10 text-center text-xs text-gray-500 leading-5">&copy; 2023 RWA-Wallet.com, Inc. All rights reserved.</p>
    </div>
  </footer>
</template>
