<script setup lang="ts">
import { getDateString } from "~/composables/misc";
import { isSameAddress } from "~/composables/web3";

const route = useRoute();
const tokenId = $computed(() => route.params.tokenId);
let isLoading = $ref(true);
let account = $(inject("account"));
let items = $ref([]);

const categoryLink = (post) => `/options/category/${kebabCase(post.category)}`;
const postLink = (post, index) => `/options/twitter/${tokenId}/${index}-${kebabCase(post.title)}`;
const { nft } = $(nftStore());

watchEffect(async () => {
  if (!account) return;
  const itemURIArr = await readContract({ account, contractName: "RWAProtocol", functionName: "getItems" }, tokenId, 0, 100, "");
  items = await Promise.all(itemURIArr.map(parseURIData));
  isLoading = false;
});
</script>

<template>
  <div class="bg-white py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto text-center max-w-2xl">
        <h2 class="font-bold tracking-tight text-3xl text-gray-900 sm:text-4xl">NFT Holder Only Content</h2>
        <p class="mt-2 text-base text-gray-600 leading-8">Get fully access by NFT Holder or One-Time-Payment NFT buyer.</p>
        <BsBtnIndigo mt-10 @click="$router.push(`/options/twitter/${tokenId}/new`)" v-if="isSameAddress(account.address, nft.tokenOwner)">Create new RWA Content</BsBtnIndigo>
      </div>
      <div v-if="isLoading" flex justify-center items-center w-full h-100>
        <div i-svg-spinners-blocks-shuffle-3 text-black class="h-14 w-14"></div>
      </div>
      <div v-else class="mx-auto mt-16 max-w-2xl grid gap-x-8 gap-y-20 grid-cols-1 lg:max-w-none lg:mx-0 lg:grid-cols-3">
        <article v-for="(post, index) in items" :key="index" class="flex flex-col items-start justify-between">
          <div class="w-full relative">
            <BsBoxImg :src="post.image" alt="" class="object-cover bg-gray-100 rounded-2xl w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]" />
            <div class="rounded-2xl ring-inset inset-0 ring-1 ring-gray-900/10 absolute" />
          </div>
          <div class="max-w-xl">
            <div class="flex mt-8 text-xs gap-x-4 items-center">
              <time :datetime="post.createdAt" class="text-gray-500">{{ getDateString(post.createdAt) }}</time>
              <router-link :to="categoryLink(post)" class="rounded-full font-medium bg-gray-50 py-1.5 px-3 text-gray-600 z-10 relative hover:bg-gray-100">{{ post.category }}</router-link>
            </div>
            <div class="group relative">
              <h3 class="font-semibold mt-3 text-lg text-gray-900 leading-6 group-hover:text-gray-600">
                <router-link :to="postLink(post, index)">
                  <span class="inset-0 absolute" />
                  {{ post.title }}
                </router-link>
              </h3>
              <p class="mt-5 text-sm text-gray-600 leading-6 line-clamp-3">{{ post.excerpt }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
