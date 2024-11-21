<template>
    <div class="modal">
        <div style="display: flex; justify-content: space-between">
            <p style="font-weight: bold">
                Заявка №{{ appeal.number }} (от
                {{ formatDateToDDMMYYYY(appeal.created_at) }})
            </p>
            <p>{{ appeal.status.name }}</p>
        </div>

        <ul class="input-fields-list">
            <li style="grid-column: span 4" class="input-field">
                <select
                    @change="fetchApartment"
                    v-model="address"
                    name=""
                    class="input-select"
                    id="">
                    <option
                        v-for="premise in this.premises"
                        :key="premise.id"
                        :value="premise.id">
                        {{ premise.address }}
                    </option>
                </select>
            </li>

            <li style="grid-column: span 4" class="input-field">
                <select name="" v-model="apartment" class="input-select">
                    <option
                        v-for="apartment in this.apartments"
                        :key="apartment.id"
                        :value="apartment.id">
                        {{ apartment.number }}
                    </option>
                </select>
            </li>

            <li style="grid-column: span 4" class="input-field">
                <input
                    v-model="due_date"
                    type="datetime-local"
                    style="
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                    " />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    name=""
                    class="input-text"
                    v-model="last_name"
                    placeholder="Фамилия"
                    id="" />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    name=""
                    class="input-text"
                    v-model="first_name"
                    placeholder="Имя"
                    id="" />
            </li>

            <!-- first name patch not allowed -->

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    v-model="patronymic_name"
                    name=""
                    class="input-text"
                    placeholder="Отчество"
                    id="" />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    name=""
                    class="input-text"
                    v-model="username"
                    placeholder="Телефон"
                    id="" />
            </li>

            <li style="grid-column: span 12" class="input-field">
                <textarea
                    v-model="description"
                    name=""
                    style="width: 100%; border: none; outline: none"
                    id=""></textarea>
            </li>
        </ul>

        <button
            @click="postAppeal"
            style="
                display: flex;
                justify-self: end;
                padding: 0.8rem 1rem;
                border: none;
                border-radius: 2px;
                color: white;
                background-color: #50b053;
            ">
            Сохранить
        </button>
    </div>
</template>
<script>
import axios from "axios";

export default {
    props: {
        appeal: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            premises: [],
            isLoading: false,
            error: null,
            address: this.appeal.premise.id,
            apartment: this.appeal.apartment.id,
            apartments: [],
            username: this.appeal.applicant.username,
            first_name: this.appeal.applicant.first_name,
            last_name: this.appeal.applicant.last_name,
            patronymic_name: this.appeal.applicant.patronymic_name,
            due_date: this.formatDateForInput(this.appeal.due_date),
            description: this.appeal.description,
        };
    },

    mounted() {
        this.fetchPremises();
        this.fetchApartment();
    },

    methods: {
        formatDateToDDMMYYYY(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        },

        formatDateForInput(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        },

        async postAppeal() {
            try {
                // eslint-disable-next-line no-unused-vars
                const response = await axios.patch(
                    `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.appeal.id}/`,
                    {
                        premise_id: this.address,
                        apartment_id: this.apartment,
                        applicant: {
                            last_name: this.last_name,
                            first_nmae: this.first_name,
                            patronymic_name: this.patronymic_name,
                            username: this.username,
                        },
                        description: this.description,
                    }
                );
                alert("Заявка изменена");
                window.location.reload();
            } catch (error) {
                alert(error.response.data.detail);
            }
        },

        async fetchPremises() {
            try {
                const response = await axios.get(
                    `https://dev.moydomonline.ru/api/geo/v2.0/user-premises/?search=`
                );
                this.premises = response.data.results;
            } catch (error) {
                console.error("Error fetching premises:", error);
                this.error = error.response
                    ? error.response.data
                    : error.message;
            }
        },

        async fetchApartment() {
            try {
                const response = await axios.get(
                    `https://dev.moydomonline.ru/api/geo/v1.0/apartments/?premise_id=${this.address}&search=`
                );
                this.apartments = response.data.results;
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style lang="scss">
.modal {
    position: fixed;
    left: 50%;
    z-index: 999999 !important;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem 2rem;
    width: 40rem;
    border-radius: 8px;
}

.input-fields-list {
    list-style: none;
    display: grid;
    padding: 0 0 0 0;
    width: 100%;
    gap: 1rem;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(3, 1fr);
}

.input-field {
    border-bottom: 1px solid gray;
}

.input-select {
    width: 100%;
    outline: none;
    border: none;
    height: 100%;
}

.input-text {
    width: 92%;
    height: 92%;
    border: none;
    outline: none;
}
</style>
