<template>
  <div class="flex flex-col gap-2">
    <SfButton size="lg" class="w-full xs:ml-4" :disabled="loading || hasItemInCart" @click="addToCart">
      <template #prefix>
        <SfIconShoppingCart size="sm" />
      </template>
      {{ buttonText }}
    </SfButton>
    <compareBtn />
  </div>
</template>

<script setup>
import { SfButton } from "@storefront-ui/vue";
import { SfIconShoppingCart } from "@storefront-ui/vue";
import { ref, computed } from 'vue';
import compareBtn from '../partials/compareBtn.vue';

// Import your Vendure GraphQL mutation and composable
import addToOrderMutation from '#graphql/app/commerce/mutations/addToOrder.graphql';
import { useVendureMutation } from '~/app/composables/useVendureMutation';

const loading = ref(false);
const buttonText = ref('Add to Cart');

const props = defineProps({
  productId: {
    type: String,
    required: false,
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

// Example: You might want to check if the item is already in the cart/order
const hasItemInCart = ref(false); // You can implement this with a query if needed

async function addToCart() {
  if (!props.productVariantId) return;
  loading.value = true;
  buttonText.value = 'Adding...';
  try {
    const { mutate } = useVendureMutation(addToOrderMutation);
    const variables = {
      productVariantId: props.productVariantId,
      quantity: props.quantity
    };
    const response = await mutate(variables);
    // Optionally update UI or state based on response
    buttonText.value = 'Added!';
    // Optionally set hasItemInCart.value = true;
  } catch (e) {
    buttonText.value = 'Error!';
    // Optionally handle error
  } finally {
    loading.value = false;
    setTimeout(() => {
      buttonText.value = 'Add to Cart';
    }, 1200);
  }
}
</script>