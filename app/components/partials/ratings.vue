<template>
    <SfRating size="lg" :half-increment="true" :value="(rating?.rating)" :max="5" />
</template>

<script setup>
    import {
        SfRating
    } from '@storefront-ui/vue';

    const props = defineProps({
        rating: {
            type: Number,
            default: 5
        },
    });
</script>