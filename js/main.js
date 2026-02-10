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
            if (card.date > card.deadline) {
                card.current = false
            }
        })
    },
    computed: {

    }
})

Vue.component('col1', {
    template: `
        <div class="col">
            <h2>Planned tasks</h2>
            <li class="cards" style="background-color: #e79ba2" v-for="card in column1">
            <a @click="deleteCard(card)">Delete</a> <a @click="card.editB = true">Edit</a>
            <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation: {{card.date}}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateTask(card)">
                            <p>New title: 
                                <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                            </p>
                            <p>New description: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                </ul>
                <a @click="nextcol(card)">Next Column</a>
            </li>
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
        updateTask(card) {
            card.editB = false
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.edit = new Date().toLocaleString()
        }
    },
})

Vue.component('col2', {
    template: `
        <div class="col">
            <h2>Tasks in progress</h2>
            <li class="cards" style="background-color: lightblue" v-for="card in column2">
                <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateTask(card)">
                            <p>New title: 
                                <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                            </p>
                            <p>New description: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                </ul>
                <a @click="nextcol(card)">Next Column</a>
            </li>
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
        updateTask(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        }
    }
})

Vue.component('col3', {
    template: `
        <div class="col">
            <h2>Testing</h2>
            <li class="cards" style="background-color: #f5f287" v-for="card in column2">
                <div class="cards" style="background-color: #f5f287" v-for="card in column3">
                    <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateTask(card)">
                            <p>New title: 
                                <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                            </p>
                            <p>New description: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                    <li class="tasks" v-if="card.transfer">
                        <form @submit.prevent="lastcol(card)">
                            <p>The reason of transfer:
                                <input type="text" v-model="card.reason">
                            </p>
                            <p>
                                <input type="submit" value="OK">
                            </p>
                        </form>
                    </li>
                </ul>
                <a @click="card.transfer =true">Last Column</a>  | <a @click="nextcol(card)">Next Column</a>
                </div>
            </li>
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
            card.transfer = false
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn2', card)
        },
        updateTask(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
        }
    }
})

Vue.component('col4', {
    template: `
        <div class="col">
            <h2>Completed tasks</h2>
            <div class="cards" style="background-color: lightgreen" v-for="card in column2">
                <div class="cards" style="background-color: lightgreen" v-for="card in column4">
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.current"> Сompleted on time</li>
                    <li class="tasks" v-else>Not completed on time</li>
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

    },
})


Vue.component('newcard', {
    template: `
    <section>
    <!-- openModal - id модального окна (элемента div) -->
    <a href="#openModal" class="btn btnModal">Create card</a>
    <div id="openModal" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Fill out the card</h3>
            <a href="#close" title="Close" class="close">×</a>
        </div>
        <div class="modal-body">    
    
        <form class="addform" @submit.prevent="onSubmit">
            <p>
                <label for="intitle">Title</label>
                <input id="intitle" required v-model="title" maxlength="30" type="text" placeholder="title">
            </p>
            <label for="indescription">Description</label>
            <textarea required id="indescription" rows="5" columns="10" v-model="description" maxlength="60"> </textarea>
            <label for="indeadline">Deadline</label>
            <input required type="date" required placeholder="дд.мм.гггг" id="indeadline" v-model="deadline">
            <button type="submit">Add a card</button>
        </form>
        
        </div>
        </div>
    </div>
    </div>
    </section>
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
                date: new Date().toLocaleDateString().split("-").reverse().join("-"),
                deadline: this.deadline,
                reason: null,
                transfer: false,
                edit: null,
                editB: false,
                comdate: null,
                current: true,
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