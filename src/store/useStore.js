import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        premise_id: null,
        token: null, // To store the authentication token
        employee_id: null, // To store the employee ID
    },
    mutations: {
        setPremiseId(state, id) {
            state.premise_id = id;
        },
        setToken(state, token) {
            state.token = token; // Mutation to set token
        },
        setEmployeeId(state, employee_id) {
            state.employee_id = employee_id; // Mutation to set employee ID
        },
    },
});

export default store;
