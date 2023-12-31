<script setup>
import { ref } from "vue";
import { FaceSmileIcon as FaceSmileIconOutline, PaperClipIcon } from "@heroicons/vue/24/outline";
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { FaceFrownIcon, FaceSmileIcon as FaceSmileIconMini, FireIcon, HandThumbUpIcon, HeartIcon, XMarkIcon } from "@heroicons/vue/20/solid";

const moods = [
  { name: "Excited", value: "excited", icon: FireIcon, iconColor: "text-white", bgColor: "bg-red-500" },
  { name: "Loved", value: "loved", icon: HeartIcon, iconColor: "text-white", bgColor: "bg-pink-400" },
  { name: "Happy", value: "happy", icon: FaceSmileIconMini, iconColor: "text-white", bgColor: "bg-green-400" },
  { name: "Sad", value: "sad", icon: FaceFrownIcon, iconColor: "text-white", bgColor: "bg-yellow-400" },
  { name: "Thumbsy", value: "thumbsy", icon: HandThumbUpIcon, iconColor: "text-white", bgColor: "bg-blue-500" },
  { name: "I feel nothing", value: null, icon: XMarkIcon, iconColor: "text-gray-400", bgColor: "bg-transparent" },
];

const selected = ref(moods[5]);
</script>

<template>
  <div class="flex items-start space-x-4">
    <div class="min-w-0 flex-1">
      <form action="#">
        <div class="border-b border-gray-200 focus-within:border-indigo-600">
          <label for="comment" class="sr-only">Add your comment</label>
          <textarea rows="3" name="comment" id="comment" class="p-3 block w-full resize-none border-0 border-b border-transparent pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Add your comment..." />
        </div>
        <div class="flex justify-between pt-2">
          <div class="flex items-center space-x-5">
            <div class="flow-root">
              <button type="button" class="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                <PaperClipIcon class="h-6 w-6" aria-hidden="true" />
                <span class="sr-only">Attach a file</span>
              </button>
            </div>
            <div class="flow-root">
              <Listbox as="div" v-model="selected">
                <ListboxLabel class="sr-only">Your mood</ListboxLabel>
                <div class="relative">
                  <ListboxButton class="relative -m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                    <span class="flex items-center justify-center">
                      <span v-if="selected.value === null">
                        <FaceSmileIconOutline class="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                        <span class="sr-only">Add your mood</span>
                      </span>
                      <span v-if="!(selected.value === null)">
                        <span :class="[selected.bgColor, 'flex h-8 w-8 items-center justify-center rounded-full']">
                          <component :is="selected.icon" class="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                        </span>
                        <span class="sr-only">{{ selected.name }}</span>
                      </span>
                    </span>
                  </ListboxButton>

                  <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="absolute z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                      <ListboxOption as="template" v-for="mood in moods" :key="mood.value" :value="mood" v-slot="{ active }">
                        <li :class="[active ? 'bg-gray-100' : 'bg-white', 'relative cursor-default select-none px-3 py-2']">
                          <div class="flex items-center">
                            <div :class="[mood.bgColor, 'flex h-8 w-8 items-center justify-center rounded-full']">
                              <component :is="mood.icon" :class="[mood.iconColor, 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                            </div>
                            <span class="ml-3 block truncate font-medium">{{ mood.name }}</span>
                          </div>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div class="flex-shrink-0">
            <BsBtnIndigo> Post </BsBtnIndigo>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
