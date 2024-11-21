<template>
    <div class="outer-box">
        <div class="modal">
            <h1 class="modal-title">Авторизация</h1>

            <div class="modal-content">
                <div class="input-group">
                    <label for="phone" class="input-label"
                        >Логин или телефон</label
                    >
                    <div class="input-wrapper">
                        <img src="../assets/ClearCont.png" alt="Phone Icon" />
                        <span>+7</span>
                        <input
                            id="phone"
                            type="number"
                            v-model="phone"
                            placeholder="Введите номер"
                            class="input-field" />
                    </div>
                </div>

                <div class="input-group">
                    <label for="password" class="input-label">Пароль</label>
                    <div class="input-wrapper">
                        <img src="../assets/Vector.png" alt="Lock Icon" />
                        <input
                            id="password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            v-model="password"
                            placeholder="Введите пароль"
                            class="input-field" />
                        <img
                            @click="togglePasswordVisibility"
                            :src="
                                isPasswordVisible
                                    ? require('@/assets/hidePw.svg')
                                    : require('@/assets/showPw.png')
                            "
                            alt="Toggle Password Visibility" />
                    </div>
                </div>

                <button @click="submit" class="submit-button">Войти</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            phone: "",
            password: "",
            isPasswordVisible: false,
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.isPasswordVisible = !this.isPasswordVisible;
        },

        async submit() {
            const apiURL = "https://dev.moydomonline.ru/api/auth/login/";
            const payload = {
                username: "7" + this.phone,
                password: this.password,
            };

            try {
                const { data } = await axios.post(apiURL, payload);

                const token = data.key;
                localStorage.setItem("authToken", token);

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Token ${token}`;

                this.$store.commit("setToken", token);
                this.$store.commit("setEmployeeId", data.employee_id);

                alert("Логин успешен!");
                this.$router.push("/");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.detail ||
                    "Ошибка при входе. Проверьте ваши данные.";
                alert(errorMessage);
            }
        },
    },
};
</script>

<style lang="scss">
$primary-color: #44a248;
$secondary-color: #50b053;
$text-color: #000;
$white-color: #fff;
$border-color: gray;

body {
    margin: 0;
}

.outer-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url("../assets/background.jpg") center/cover no-repeat !important;
}

.modal {
    position: relative;
    width: 18rem;
    padding: 2rem;
    background-color: $white-color;
    border-radius: 10px;

    .modal-title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;
        width: 90%;
        margin: 0 auto;
        font-size: 1.25rem;
        color: $white-color;
        background-color: $primary-color;
        border-radius: 5px;
        transform: translateY(-100%);
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;

        .input-group {
            width: 100%;

            .input-label {
                padding-left: 1rem;
                font-size: 0.9rem;
                color: $secondary-color;
            }

            .input-wrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0;
                border-bottom: 1px solid $border-color;

                img {
                    width: 1.2rem;
                    height: 1.2rem;
                }

                p {
                    margin: 0;
                    color: $text-color;
                }

                .input-field {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                }
            }
        }
    }

    .submit-button {
        margin-top: 1.5rem;
        padding: 0.8rem 3rem;
        font-size: 1rem;
        color: $white-color;
        background-color: $secondary-color;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: $primary-color;
        }
    }
}
</style>
