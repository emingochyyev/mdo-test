<template>
    <div class="modal">
        <div style="display: flex; justify-content: space-between">
            <p style="font-weight: bold">Создание заявки</p>
            <p>Новая</p>
        </div>

        <ul class="input-fields-list">
            <li style="grid-column: span 4" class="input-field">
                <select
                    @change="fetchApartment"
                    v-model="address"
                    name=""
                    class="input-select"
                    id="">
                    <option value="placeholder" disabled hidden selected>
                        Дом
                    </option>
                    <option
                        v-for="premise in this.premises"
                        :key="premise.id"
                        :value="premise.id">
                        {{ premise.address }}
                    </option>
                </select>
            </li>

            <li style="grid-column: span 4" class="input-field">
                <select name="" v-model="apartment" class="input-select" id="">
                    <option value="placeholder" disabled hidden selected>
                        Квартира
                    </option>
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
                    placeholder="Срок"
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
                    placeholder="Фамилия"
                    name=""
                    class="input-text"
                    v-model="last_name"
                    id="" />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    name=""
                    placeholder="Имя"
                    class="input-text"
                    v-model="first_name"
                    id="" />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    placeholder="Отчество"
                    type="text"
                    v-model="patronymic_name"
                    name=""
                    class="input-text"
                    id="" />
            </li>

            <li style="grid-column: span 3" class="input-field">
                <input
                    type="text"
                    name=""
                    placeholder="Телефон"
                    class="input-text"
                    v-model="username"
                    id="" />
            </li>

            <li style="grid-column: span 12" class="input-field">
                <textarea
                    v-model="description"
                    name=""
                    rows="4"
                    placeholder="Описание заявки"
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
                color: white;
                background-color: #50b053;
            ">
            Создать
        </button>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            premises: [],
            isLoading: false,
            error: null,
            address: "placeholder",
            apartment: "placeholder",
            apartments: [],
            username: null,
            first_name: "",
            last_name: "",
            patronymic_name: "",
            due_date: new Date(),
            description: "",
        };
    },

    mounted() {
        this.fetchPremises();
    },

    methods: {
        async postAppeal() {
            try {
                // eslint-disable-next-line no-unused-vars
                const response = await axios.post(
                    "https://dev.moydomonline.ru/api/appeals/v1.0/appeals/",
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
                        due_date: this.due_date,
                        status_id: 1,
                    }
                );
                alert("Заявка добавлена!");
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
