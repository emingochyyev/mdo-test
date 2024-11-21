<template>
    <ul
        style="
            align-items: center;
            list-style: none;
            display: grid;
            padding: 0 0 0 0;
            grid-template-columns: repeat(12, 1fr);
        ">
        <li
            style="
                grid-column: span 1;
                display: flex;
                justify-items: center;
                cursor: pointer;
            ">
            <button
                @click="editAppeal"
                style="
                    cursor: pointer;
                    color: white;
                    width: 80%;
                    border-radius: 5px;
                    margin-left: auto;
                    margin-right: auto;
                    border: none;
                    background-color: #50b053;
                    padding: 5% 2px;
                ">
                {{ appeal?.number }}
            </button>
        </li>

        <li style="grid-column: span 2">
            <p style="text-align: center; width: 100%">
                {{ formatDateToDDMMYYYY(appeal.created_at) }}
            </p>
        </li>

        <li style="grid-column: span 2">
            <p style="text-align: center; width: 100%">
                {{ appeal?.premise?.address || " " }}
            </p>
        </li>

        <li style="grid-column: span 2">
            <p style="text-align: center; width: 100%">
                {{ formatName(appeal?.applicant) || " " }}
            </p>
        </li>

        <li style="grid-column: span 2">
            <p
                style="
                    text-align: center;
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                ">
                {{ appeal?.description || " " }}
            </p>
        </li>

        <li style="grid-column: span 2">
            <p style="text-align: center; width: 100%">
                {{ appeal?.due_date || " " }}
            </p>
        </li>

        <li style="grid-column: span 1">
            <p style="text-align: center; width: 100%">
                {{ appeal?.status?.name || " " }}
            </p>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        appeal: {
            type: Object, // Expecting an object for the prop
            required: true, // Make it required
        },
    },

    methods: {
        editAppeal() {
            this.$emit("edit-appeal", this.appeal);
        },

        formatDateToDDMMYYYY(dateString) {
            if (!dateString) return ""; // Handle empty or undefined dates
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        },

        formatName(applicant) {
            if (!applicant) return "";
            const { last_name, first_name, patronymic_name } = applicant;

            const firstInitial = first_name
                ? first_name.charAt(0).toUpperCase() + "."
                : "";
            const patronymicInitial = patronymic_name
                ? patronymic_name.charAt(0).toUpperCase() + "."
                : "";

            return `${
                last_name || ""
            } ${firstInitial} ${patronymicInitial}`.trim();
        },
    },
};
</script>
