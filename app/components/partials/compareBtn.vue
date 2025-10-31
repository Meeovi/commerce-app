<template>
  <div class="flex flex-col gap-2">
    <SfButton size="lg" class="w-full xs:ml-4" :disabled="cartLoading || hasItemInCart" @click="handleAddToCart">
      <template #prefix>
        <SfIconShoppingCart size="sm" />
      </template>
      {{ buttonText }}
    </SfButton>
    
    <SfButton 
      size="lg" 
      class="w-full xs:ml-4" 
      :variant="isInCompare ? 'secondary' : 'tertiary'"
      :disabled="compareLoading"
      @click="handleCompare"
    >
      <template #prefix>
        <SfIconCompareArrows size="sm" />
      </template>
      {{ compareButtonText }}
    </SfButton>
  </div>
</template>

<script setup>
import { SfButton } from "@storefront-ui/vue";
import { SfIconShoppingCart, SfIconCompareArrows} from "@storefront-ui/vue";
import { ref, computed, onMounted } from 'vue';
import addToOrderMutation from '#graphql/app/commerce/mutations/addItemToOrder.gql';
import addToCompareMutation from '#graphql/app/commerce/mutations/addToCompare.graphql';
import removeFromCompareMutation from '#graphql/app/commerce/mutations/removeFromCompare.graphql';
import getCompareListQuery from '#graphql/app/commerce/queries/getCompareList.graphql';
import getActiveOrderQuery from '#graphql/app/commerce/queries/activeOrder.gql';
import { useVendureMutation } from '~/app/composables/useVendureMutation';
import { useNuxtApp } from '#app';

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  productVariantId: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const nuxtApp = useNuxtApp();
const cartLoading = ref(false);
const compareLoading = ref(false);
const compareList = ref([]);
const activeOrder = ref(null);

// Fetch compare list
async function fetchCompareList() {
  const res = await nuxtApp.$graphql.request(getCompareListQuery);
  compareList.value = res?.compareList?.items || [];
}

// Fetch active order
async function fetchActiveOrder() {
  const res = await nuxtApp.$graphql.request(getActiveOrderQuery);
  activeOrder.value = res?.activeOrder || null;
}

onMounted(() => {
  fetchCompareList();
  fetchActiveOrder();
});

const hasItemInCart = computed(() => {
  return activeOrder.value?.lines?.some(line => line.productVariant.id === props.productVariantId);
});

const isInCompare = computed(() => {
  return compareList.value.some(item => item.product.id === props.productId);
});

const buttonText = computed(() => {
  if (cartLoading.value) return "Adding...";
  if (hasItemInCart.value) return "In Cart";
  return "Add to Cart";
});

const compareButtonText = computed(() => {
  if (compareLoading.value) return "Updating...";
  return isInCompare.value ? "Remove from Compare" : "Add to Compare";
});

const { mutate: addToOrder } = useVendureMutation(addToOrderMutation);
const { mutate: addToCompare } = useVendureMutation(addToCompareMutation);
const { mutate: removeFromCompare } = useVendureMutation(removeFromCompareMutation);

async function handleAddToCart() {
  if (!props.productVariantId) return;
  cartLoading.value = true;
  try {
    await addToOrder({ productVariantId: props.productVariantId, quantity: props.quantity });
    await fetchActiveOrder();
  } catch (e) {
    // Optionally handle error
  } finally {
    cartLoading.value = false;
  }
}

async function handleCompare() {
  compareLoading.value = true;
  try {
    if (isInCompare.value) {
      await removeFromCompare({ productId: props.productId });
    } else {
      await addToCompare({ productId: props.productId });
    }
    await fetchCompareList();
  } catch (e) {
    // Optionally handle error
  } finally {
    compareLoading.value = false;
  }
}
</script>

<style scoped>
  /* Add any custom styles here */
</style>