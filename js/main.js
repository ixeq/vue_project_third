let eventBus = new Vue()

Vue.component('cols', {
    template:`
    <div id="cols">
        <p class="error" v-for="error in errors">{{error}}</p>
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
            errors: []
        }
    },
    methods: {

    },
    mounted() {
        eventBus.$on('addColumn1', card => {
            this.errors = []
            if (this.column1.length < 3){
                this.column1.push(card)
            } else {
                this.errors.push('There should be no more than three cards in the first column')
            }
        })
        eventBus.$on('addColumn2', card => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            } else {
                this.errors.push("There should be no more than five cards in the second column")
            }
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
        eventBus.$on('addColumn1-3', card => {
            this.column3.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
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
                <card :card="card"></card>
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
        changeCompleted(card, task) {
            eventBus.$emit('addColumn2', card)
        },
        deleteCard(card) {
            this.column1.splice(this.column1.indexOf(card),1)
        }
    },
})

Vue.component('col2', {
    template: `
        <div class="col">
            <h2>Tasks in progress</h2>
            <div class="cards" style="background-color: lightblue" v-for="card in column2">
            <card :card="card"></card>
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
        changeCompleted(card, task) {
            task.completed = true
            card.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                if (card.subtasks[i].title != null) {
                    count++
                }
            }
            if ((card.status / count) * 100 === 100) {
                eventBus.$emit('addColumn4', card)
                card.date = new Date().toLocaleString();
            }
        }
    }
})

Vue.component('col3', {
    template: `
        <div class="col">
            <h2>Testing</h2>
            <div class="cards" style="background-color: #f5f287" v-for="card in column2">
                <div class="cards" style="background-color: #f5f287" v-for="card in column3">
                    <card :card="card"></card>   
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
        changeCompleted(card, task) {
            task.completed = true
            card.status += 1
            let count = 0
            for (let i = 0; i < 5; i++) {
                if (card.subtasks[i].title != null) {
                    count++
                }
            }
            if ((card.status / count) * 100 === 100) {
                eventBus.$emit('addColumn4', card)
                card.date = new Date().toLocaleString();
            }
        }
    }
})

Vue.component('col4', {
    template: `
        <div class="col">
            <h2>Completed tasks</h2>
            <div class="cards" style="background-color: lightgreen" v-for="card in column2">
                <div class="cards" style="background-color: lightgreen" v-for="card in column4">
                    <card :card="card"></card>
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

    }
})

Vue.component('card', {
    template: `
    <div class="cards">
        <a @click="deleteCard(card)">Delete</a><a @click="editCard(card)">Edit</a>
        <input id="title" required maxlength="30" type="text" value="card.title">
        <ul>
            <li class="tasks">Description:
            <textarea required id="description"  maxlength="60" value="card.description"></textarea></li>
            <li class="tasks">Date of creation:
            {{ card.date }}</li>
            <li class="tasks">Deadline: 
            <input required type="date" id="deadline"  placeholder="card.deadline"></li>
        </ul>
        <a @click="nextcol(card)">Next Column</a>
    </div>
    `,
    props: {
        card: {
            type: Object,
            required: true
        },
        deleteCard: {
            type: Function
        },
        editCard: {
            type: Function
        },
        nextcol: {
            type: Function
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
                <textarea required id="indescription" v-model="description" maxlength="60"> </textarea>
            </div>
            <div>
                <label for="indeadline">Deadline</label>
                <input required type="date" id="indeadline" v-model="deadline">
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