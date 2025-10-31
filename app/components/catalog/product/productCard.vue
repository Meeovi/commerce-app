<template>
  <div>
    <div class="border border-neutral-200 rounded-md hover:shadow-lg max-w-[300px]">
      <div class="relative">
        <SfLink :href="`/product/${product.id}`" class="block">
          <NuxtImg :src="product.featuredAsset?.preview" :alt="product.name" class="block object-cover h-auto rounded-md aspect-square" width="300" height="300" />
        </SfLink>
        <SfButton variant="tertiary" size="sm" square
          class="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
          aria-label="Add to wishlist">
          <SfIconFavorite size="sm" />
        </SfButton>
      </div>
      <div class="p-4 border-t border-neutral-200" style="background-color: white !important;">
        <SfLink :href="`/product/${product.id}`" variant="secondary" class="no-underline"> {{ product.name }} </SfLink>
        <div class="flex items-center pt-1">
          <SfRating size="xs" :value="product.customFields?.rating || 0" :max="5" />
          <SfLink :href="`/product/${product.id}`" variant="secondary" class="pl-1 no-underline">
            <SfCounter size="xs">{{ product.customFields?.rating || 0 }}</SfCounter>
          </SfLink>
        </div>
        <p class="block py-2 font-normal leading-5 typography-text-sm text-neutral-700">
          By: <span v-for="facet in product.facetValues" :key="facet.id">{{ facet.facet.name }}</span>
        </p>
        <span class="block pb-2 font-bold typography-text-lg">
          {{ formatPrice(product.priceWithTax?.min) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfRating, SfCounter, SfLink, SfButton, SfIconFavorite } from '@storefront-ui/vue';
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (amount: number | undefined) => {
  if (!amount || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
};
</script>