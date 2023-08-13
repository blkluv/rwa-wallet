<script setup lang="ts">
const { item, params } = $(itemStore());
const tags = $computed(() => {
  if (!item.tags) return "";
  return item.tags
    .split(",")
    .map((v) => trim(v))
    .join(",");
});

const shareLink = $computed(() => `https://rwa-nft.com/twitter/${params.tokenId}/${params.itemId}-${kebabCase(item.title)}`);
const twitterShareLink = $computed(() => {
  return `https://twitter.com/intent/tweet?text=Share my RWA: ${item.title} @HelloRWA  &url=${shareLink}&hashtags=${tags}`;
});
</script>

<template>
  <div class="bg-white pb-5 relative">
    <div class="mx-auto max-w-7xl lg:flex lg:justify-between xl:justify-end">
      <div class="lg:flex lg:w-1/2 lg:shrink lg:grow-0 xl:inset-y-0 xl:right-1/2 xl:w-1/2 xl:absolute">
        <div class="h-80 relative xl:ml-0" lg="-ml-8 w-full grow h-[calc(100vh-184px)]">
          <BsBoxImg class="h-full object-cover bg-gray-50 w-full inset-0 absolute" :src="item.image" alt="" :hasModal="true" />
        </div>
      </div>
      <div class="pt-6 lg:contents">
        <div class="mx-auto px-12 xl:w-1/2" lg="flex-none mr-0 w-full h-[calc(100vh-184px)] overflow-y-scroll">
          <!-- <BsAuthorBox :author="author" sticky top-0 bg-white /> -->
          <div flex justify-between items-center>
            <BsTags :tags="tags" />
            <a target="_blank" :href="twitterShareLink" class="rounded-full bg-gray-100 m-2 text-sm py-1 px-3 text-gray-500 inline-flex items-center hover:bg-gray-200" title="Share this RWA to twitter">
              <span i-devicon:twitter mr-1></span>
              Twitter
            </a>
          </div>
          <TwitterItemContent />
          <!-- <LandingItemTimeline mb-10 /> -->

          <!-- <LandingItemCommentbox sticky bottom-0 bg-white /> -->
        </div>
      </div>
    </div>
  </div>
</template>
