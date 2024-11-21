<template>
    <div>
        <button @click="showCreateAppeal = true" class="button-create">
            Создать
        </button>

        <div
            @click="showCreateAppeal = false"
            v-if="showCreateAppeal"
            class="modal-background">
            <div @click.stop>
                <CreateAppeal />
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 1rem">
            <div
                style="
                    display: flex;
                    border-bottom: 1px solid gray;
                    width: 40%;
                ">
                <input
                    @change="fetchAppeals"
                    v-model="searchQuery"
                    type="text"
                    style="width: 100%; outline: none; border: none"
                    placeholder="Поиск (№ заявки, название)" />
                <img src="../assets/search.png" alt="" />
            </div>

            <div
                style="
                    display: flex;
                    border-bottom: 1px solid gray;
                    width: 40%;
                ">
                <select
                    v-model="premise_id"
                    @change="updatePremiseId"
                    name=""
                    style="width: 100%; border: none; outline: none"
                    id="">
                    <option
                        v-for="premise in this.premises"
                        :key="premise.id"
                        :value="premise.id">
                        {{ premise.address }}
                    </option>
                </select>
            </div>
        </div>

        <ul class="menu-header">
            <li style="grid-column: span 1">№</li>
            <li style="grid-column: span 2">Создана</li>
            <li style="grid-column: span 2">Адрес</li>
            <li style="grid-column: span 2">Заявитель</li>
            <li style="grid-column: span 2">Описание</li>
            <li style="grid-column: span 2">Срок</li>
            <li style="grid-column: span 1">Статус</li>
        </ul>

        <ul style="list-style: none; padding: 0 0 0 0">
            <li
                v-for="appeal in this.appeals"
                style="border-bottom: 1px solid gray"
                :key="appeal.id">
                <AppealCard :appeal="appeal" @edit-appeal="handleEditAppeal" />
            </li>
        </ul>

        <div
            @click="showEditAppeal = false"
            v-if="showEditAppeal"
            style="
                height: 100vh;
                width: 100vw;
                background-color: rgba(0, 0, 0, 0.6);
                position: fixed;
                top: 0;
                left: 0;
            ">
            <div @click.stop>
                <EditAppeal :appeal="editAppealData" />
            </div>
        </div>

        <div
            style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            ">
            <label>
                Записей на страницу:
                <input
                    type="number"
                    v-model="per_page"
                    @change="fetchAppeals"
                    style="width: 60px; margin-left: 5px; outline: none" />
            </label>
            <vuePagination
                :texts="paginationTexts"
                edgeNavigation="true"
                style="list-style: none; cursor: pointer"
                v-model="page_num"
                :records="total_records"
                :per-page="10"
                @paginate="fetchAppeals" />
        </div>
    </div>
</template>

<script>
import axios from "axios"; // Import axios
import AppealCard from "../components/AppealCard.vue";
import EditAppeal from "../components/EditAppeal.vue";
import CreateAppeal from "@/components/CreateAppeal.vue";

export default {
    data() {
        return {
            appeals: [], // To store the API response
            premises: [],
            premise_id: this.$store.state.premise_id || "",
            page_num: 1,
            per_page: 10,
            showEditAppeal: false,
            editAppealData: null,
            showCreateAppeal: false,
            total_records: 0,
            searchQuery: "",
            paginationTexts: {
                count: "показывается {from}-{to} из {count}", // Custom text for pagination
                first: "Первая",
                last: "Последняя",
            },
        };
    },

    components: {
        AppealCard,
        EditAppeal,
        CreateAppeal,
    },

    mounted() {
        this.fetchAppeals();
        this.fetchPremises();

        // axios.get("https://dev.moydomonline.ru/api/geo/v2.0/user-premises/");
    },
    methods: {
        updatePremiseId() {
            // console.log(this.premise_id);
            this.$store.commit("setPremiseId", this.premise_id);
            console.log(this.$store.state.premise_id);
            this.fetchAppeals();
        },

        async fetchAppeals() {
            const apiURL = `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/?premise_id=${this.premise_id}&search=${this.searchQuery}&page_size=${this.per_page}&page=${this.page_num}`;

            try {
                const response = await axios.get(apiURL);
                this.appeals = response.data.results;
                this.total_records = response.data.count;
            } catch (error) {
                console.error(
                    "Error fetching appeals:",
                    error.response?.data || error.message
                );
            }
        },

        async fetchPremises() {
            try {
                const response = await axios.get(
                    "https://dev.moydomonline.ru/api/geo/v2.0/user-premises/"
                );
                this.premises = response.data.results; // Store the fetched data in `premises`
            } catch (error) {
                console.error(
                    "Error fetching premises:",
                    error.response?.data || error.message
                );
            }
        },

        handleEditAppeal(appeal) {
            this.showEditAppeal = true;
            this.editAppealData = appeal;
        },
    },
};
</script>
<!-- 
<style lang="scss">
.VuePagination__count {
    display: none;
}
.VuePagination__pagination {
    list-style: none;
    display: flex;
    // gap: 2px;

    .page-item {
        // background-color: lightgray;
        color: black; /* Default text color */
        border-radius: 100%; /* Fully rounded */
        padding-left: 1rem; /* Padding of 1 rem */
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        display: inline-flex; /* Ensures proper alignment */
        align-items: center; /* Centers text vertically */
        justify-content: center; /* Centers text horizontally */
        text-decoration: none; /* Removes underline for links */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s ease, color 0.3s ease;

        &.active {
            background-color: green; /* Green background for the active page */
            color: white; /* White text for the active page */
            font-weight: bold; /* Emphasize the active page */
        }

        &:hover {
            // background-color: darkgray;
        }
    }
}
</style> -->
<style lang="scss">
.VuePagination__count {
    display: none; // Hides the pagination count
}

.VuePagination__pagination {
    list-style: none;
    display: flex;

    .page-item {
        color: black; // Default text color
        border-radius: 50%; // Fully rounded for circular buttons
        padding: 0.5rem 1rem; // Consistent padding
        display: inline-flex; // Ensures proper alignment
        align-items: center; // Vertically centers text
        justify-content: center; // Horizontally centers text
        text-decoration: none; // Removes underline
        cursor: pointer; // Pointer cursor on hover
        transition: background-color 0.3s ease, color 0.3s ease; // Smooth transition for hover effects

        &.active {
            background-color: green; // Highlight active page
            color: white; // Contrasting text color for active page
            font-weight: bold; // Makes active page stand out
        }

        &:hover {
            background-color: lightgray; // Add subtle hover effect
        }
    }
}

.button-create {
    display: flex;
    justify-self: end;
    margin: 1rem;
    padding: 0.5rem 1rem;
    background-color: #50b053;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 5px;
}

.menu-header {
    display: grid;
    padding: 0 0 0 0;
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    list-style: none;
    grid-template-columns: repeat(12, 1fr);

    li {
        text-align: center;
        color: green;
    }
}

.modal-background {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
}
</style>
