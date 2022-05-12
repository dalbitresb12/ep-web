<script setup>
import { onMounted, ref } from "vue";
import { PrimeIcons, FilterMatchMode } from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import { ChallengesService } from "../services/challenges.service";

const service = new ChallengesService();
const confirm = useConfirm();

const data = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const fields = [
  { key: "id", label: "ID", hidden: true },
  { key: "title", label: "Title", required: true, type: "text" },
  { key: "businessId", label: "Business ID", required: true, type: "number" },
  { key: "urlToImage", label: "Image", required: true, type: "text" },
  {
    key: "challengeType",
    label: "Challenge Type",
    required: true,
    type: "dropdown",
    options: [
      { value: "individual", label: "Individual" },
      { value: "team", label: "Team" },
    ],
  },
];

const modalVisible = ref(false);
const modalSubmitted = ref(false);
const currentChallenge = ref({});

const handleFetch = async () => {
  const res = await service.getAll();
  data.value = res.data;
};

const handleEdit = item => {
  modalVisible.value = true;
  modalSubmitted.value = false;
  currentChallenge.value = item;
};

const handleNew = () => handleEdit({});

const handleCancel = () => {
  modalVisible.value = false;
  modalSubmitted.value = false;
  currentChallenge.value = {};
};

const handleSave = async () => {
  modalSubmitted.value = true;
  for (const field of fields) {
    if (field.required && !currentChallenge.value[field.key]) {
      return;
    }
  }

  const isUpdate = !!currentChallenge.value.id;
  if (isUpdate) {
    await service.update(currentChallenge.value);
  } else {
    await service.create(currentChallenge.value);
  }

  handleCancel();
  handleFetch();
};

const handleDelete = item => {
  confirm.require({
    header: "Confirmation",
    message: `Are you sure you want to delete ${item.title}?`,
    icon: PrimeIcons.EXCLAMATION_TRIANGLE,
    accept: async () => {
      await service.delete(item.id);
      handleFetch();
    },
  });
};

/** @param {string} str */
const capitalize = str => `${str.at(0).toLocaleUpperCase()}${str.substring(1)}`;

onMounted(handleFetch);
</script>

<template>
  <Toolbar
    class="p-0 mb-1 flex justify-start items-center flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
    <template #start>
      <h2>Manage Challenges</h2>
    </template>

    <template #end>
      <div class="flex items-center space-x-4">
        <Button label="New" :icon="PrimeIcons.PLUS" @click="handleNew" />
        <InputText
          v-model="filters.global.value"
          type="text"
          placeholder="Search..."
          class="p-inputtext-sm" />
      </div>
    </template>
  </Toolbar>
  <DataTable
    :value="data"
    data-key="id"
    :filters="filters"
    :paginator="true"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows="10"
    :rows-per-page-options="[5, 10, 15]"
    current-page-report-template="Showing {first} to {last} of {totalRecords} challenges"
    responsive-layout="scroll">
    <Column
      v-for="field in fields"
      :key="field.key"
      :field="field.key"
      :header="field.label"
      :sortable="field.key !== 'urlToImage'">
      <template #body="props">
        <div
          v-if="field.key === 'urlToImage'"
          class="w-12 h-12 overflow-hidden">
          <img :src="props.data[field.key]" class="object-cover h-full" />
        </div>
        <template v-else-if="field.key === 'challengeType'">
          {{ capitalize(props.data[field.key]) }}
        </template>
        <template v-else>
          {{ props.data[field.key] }}
        </template>
      </template>
    </Column>
    <Column>
      <template #body="props">
        <Button
          :icon="PrimeIcons.PENCIL"
          class="p-button-rounded p-button-text"
          @click="handleEdit(props.data)" />
        <Button
          :icon="PrimeIcons.TRASH"
          class="p-button-rounded p-button-text p-button-danger"
          @click="handleDelete(props.data)" />
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="modalVisible"
    :header="!currentChallenge.id ? 'Create Challenge' : 'Edit Challenge'"
    :modal="true"
    class="w-full sm:w-1/2 mx-4">
    <div class="flex flex-col space-y-4">
      <template v-for="field in fields" :key="field.key">
        <div v-if="!field.hidden" class="flex flex-col space-y-1">
          <span class="p-float-label">
            <InputText
              v-if="field.type === 'text'"
              :id="`challenge_form-${field.key}`"
              v-model="currentChallenge[field.key]"
              :required="field.required"
              :aria-required="field.required ? 'true' : 'false'"
              class="w-full"
              :class="{
                'p-invalid': modalSubmitted && !currentChallenge[field.key],
              }" />
            <InputNumber
              v-else-if="field.type === 'number'"
              :id="`challenge_form-${field.key}`"
              v-model="currentChallenge[field.key]"
              :aria-required="field.required ? 'true' : 'false'"
              class="w-full"
              :class="{
                'p-invalid': modalSubmitted && !currentChallenge[field.key],
              }" />
            <Dropdown
              v-else-if="field.type === 'dropdown'"
              :id="`challenge_form-${field.key}`"
              v-model="currentChallenge[field.key]"
              :options="field.options"
              option-label="label"
              option-value="value"
              :aria-required="field.required ? 'true' : 'false'"
              class="w-full"
              :class="{
                'p-invalid': modalSubmitted && !currentChallenge[field.key],
              }" />
            <label :for="`challenge_form-${field.key}`">
              {{ field.label }}
            </label>
          </span>
          <small
            v-if="modalSubmitted && !currentChallenge[field.key]"
            class="p-error">
            {{ field.label }} is required
          </small>
        </div>
      </template>
    </div>
    <template #footer>
      <div class="space-x-4">
        <Button label="Save" :icon="PrimeIcons.SAVE" @click="handleSave" />
        <Button
          label="Cancel"
          :icon="PrimeIcons.TRASH"
          class="p-button-danger"
          @click="handleCancel" />
      </div>
    </template>
  </Dialog>
  <ConfirmDialog />
</template>
