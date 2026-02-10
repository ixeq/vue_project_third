let eventBus = new Vue()

Vue.component('cols', {
    template:`
    <div id="cols">
        <newcard></newcard>
        <div class="cols__content">
            <col1 :column1="column1"></col1>
            <col2 :column2="column2"></col2>
            <col3 :column3="column3"></col3>
            <col4 :column4="column4"></col4>
        </div>
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: [],
        }
    },
    methods: {

    },
    mounted() {
        eventBus.$on('addColumn1', card => {
            this.column1.push(card)
        })
        eventBus.$on('addColumn2', card => {
            this.column2.push(card)
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
        })
        eventBus.$on('addColumn4', card => {
            this.column4.push(card)
            card.comdate = new Date().toLocaleDateString()
            console.log(card.comdate)
            console.log(card.deadline)
        })
    },
    computed: {

    }
})

Vue.component('col1', {
    template: `
        <div class="col">
            <h2>Planned tasks</h2>
            <div class="cards" style="background-color: #e79ba2" v-for="card in column1">
            <a @click="deleteCard(card)">Delete</a> <a @click="editCard(card)">Edit</a>
            <p>{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation: {{card.date}}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                </ul>
                <a @click="nextcol(card)">Next Column</a>
            </div>
        </div>
    `,
    props: {
        column1: {
            type: Array,
        },
        column2: {
            type: Array,
        },
        card: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    methods: {
        nextcol(card) {
            this.column1.splice(this.column1.indexOf(card), 1)
            eventBus.$emit('addColumn2', card)
            },
        deleteCard(card) {
            this.column1.splice(this.column1.indexOf(card),1)
        },
        editCard(card) {
            card.title = prompt('new title', card.title)
            card.description = prompt('new description', card.description)
            card.deadline = prompt('new deadline', card.deadline)
            card.edit = new Date().toLocaleString()
        }
    },
})

Vue.component('col2', {
    template: `
        <div class="col">
            <h2>Tasks in progress</h2>
            <div class="cards" style="background-color: lightblue" v-for="card in column2">
                <a @click="editCard(card)">Edit</a> <br>
                <p>{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                </ul>
                <a @click="nextcol(card)">Next Column</a>
            </div>
        </div>
    `,
    props: {
        column3: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column2.splice(this.column2.indexOf(card), 1)
            eventBus.$emit('addColumn3', card)
        },
        editCard(card) {
            card.title = prompt('new title', card.title)
            card.description = prompt('new description', card.description)
            card.deadline = prompt('new deadline', card.deadline)
            card.edit = new Date().toLocaleString()
        }
    }
})

Vue.component('col3', {
    template: `
        <div class="col">
            <h2>Testing</h2>
            <div class="cards" style="background-color: #f5f287" v-for="card in column2">
                <div class="cards" style="background-color: #f5f287" v-for="card in column3">
                    <a @click="editCard(card)">Edit</a> <br>
                <p>{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                </ul>
                <a @click="lastcol(card)">Last Column</a>  | <a @click="nextcol(card)">Next Column</a>
                </div>
            </div>
        </div>
    `,
    props: {
        column3: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn4', card)
        },
        lastcol(card) {
            card.reason = prompt('reason for transfer')
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn2', card)
        },
        editCard(card) {
            card.title = prompt('new title', card.title)
            card.description = prompt('new description', card.description)
            card.deadline = prompt('new deadline', card.deadline)
            card.edit = new Date().toLocaleString()
        }
    }
})

Vue.component('col4', {
    template: `
        <div class="col">
            <h2>Completed tasks</h2>
            <div class="cards" style="background-color: lightgreen" v-for="card in column2">
                <div class="cards" style="background-color: lightgreen" v-for="card in column4">
                <p>{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.deadline >= card.comdate">Сompleted on time</li>
                    <li class="tasks" v-if="card.deadline < card.comdate">Not completed on time</li>
                </ul>
                </div>
        </div>
    `,
    props: {
        column4: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {

    },
    computed:  {
        completedCard() {
            let completed = null
            if (cols.column4.card.deadline < cols.column4.card.comdate) {
                completed = 'Сompleted on time'
            } else {
                completed = 'Not completed on time'
            }
            return completed
        }
    },
})


Vue.component('newcard', {
    template: `
    <div class="addform">
        <form @submit.prevent="onSubmit">
            <p>
                <label for="intitle">Title</label>
                <input id="intitle" required v-model="title" maxlength="30" type="text" placeholder="title">
            </p>
            <div>
                <label for="indescription">Description</label>
                <textarea required id="indescription" rows="5" columns="10" v-model="description" maxlength="60"> </textarea>
            </div>
            <div>
                <label for="indeadline">Deadline</label>
                <input required type="date" required placeholder="дд.мм.гггг" id="indeadline" v-model="deadline">
            </div>
            <button type="submit">Add a task</button>
        </form>
    </div>
    `,
    data() {
        return {
            title:null,
            description: null,
            date: null,
            deadline: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                date: new Date().toLocaleString(),
                deadline: this.deadline,
                reason: null,
                edit: null,
                comdate: null,
            }
            eventBus.$emit('addColumn1', card)
            this.title = null
            this.deadline = null
            this.date = null
            this.description = null
            console.log(card)
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Kanban'
    },
    methods: {

    }
})