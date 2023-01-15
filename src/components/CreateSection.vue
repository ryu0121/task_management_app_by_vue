<template>
  <div class="input-group mb-3 w-50">
    <input type="text" class="form-control" placeholder="create a section"
      aria-label="Recipient's username" aria-describedby="button-addon"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <button class="btn btn-outline-secondary" type="button" id="button-addon"
      :disabled="isDisabled"
      @click="click"
    >Create</button>
  </div>
</template>

<script>
export default {
  name: 'CreateSection',
  props: {
    isDisabled: Boolean,
    modelValue: String,
  },
  emits: ['update:modelValue'],
}
</script>