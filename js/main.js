let eventBus = new Vue({
    data: {
        draggedCard: null,
        draggedFromColumn: null
    }
})

Vue.component('cols', {
    template:`
    <div id="cols">
        <newcard></newcard>
        <div class="cols__content">
            <col1 
                :column1="column1" 
                @drop-card="handleDrop"
                column-id="column1"
            ></col1>
            <col2 
                :column2="column2" 
                @drop-card="handleDrop"
                column-id="column2"
            ></col2>
            <col3 
                :column3="column3" 
                @drop-card="handleDrop"
                column-id="column3"
            ></col3>
            <col4 
                :column4="column4" 
                @drop-card="handleDrop"
                column-id="column4"
            ></col4>
        </div>
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: []
        }
    },
    methods: {
        handleDrop(data) {
            const { card, fromColumn, toColumn } = data
            this[fromColumn] = this[fromColumn].filter(c => c.id !== card.id)
            this[toColumn].push(card)
            if (toColumn === 'column4') {
                this.checkDeadline(card)
            }
        },
        checkDeadline(card) {
            const cardDate = new Date(card.date.split('-').reverse().join('-'))
            const deadlineDate = new Date(card.deadline)
            if (cardDate > deadlineDate) {
                card.current = false
            }
        }
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
            this.checkDeadline(card)
        })
    }
})


const draggableMixin = {
    methods: {
        dragStart(event, card, columnId) {
            eventBus.draggedCard = card
            eventBus.draggedFromColumn = columnId
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', JSON.stringify(card))
            event.target.classList.add('dragging')
        },
        allowDrop(event) {
            event.preventDefault()
            const colElement = event.target.closest('.col')
            if (colElement) {
                colElement.classList.add('drag-over')
            }
        },
        drop(event, toColumn) {
            event.preventDefault()
            document.querySelectorAll('.col.drag-over').forEach(el => {
                el.classList.remove('drag-over')
            })
            document.querySelectorAll('.cards.dragging').forEach(el => {
                el.classList.remove('dragging')
            })

            const data = event.dataTransfer.getData('text/plain')
            if (data) {
                const card = JSON.parse(data)
                this.$parent.handleDrop({
                    card: card,
                    fromColumn: eventBus.draggedFromColumn,
                    toColumn: toColumn
                })
            }
        },
        dragEnd(event) {
            document.querySelectorAll('.col.drag-over').forEach(el => {
                el.classList.remove('drag-over')
            })
            document.querySelectorAll('.cards.dragging').forEach(el => {
                el.classList.remove('dragging')
            })
        }
    }
}

Vue.component('col1', {
    mixins: [draggableMixin],
    template: `
        <div 
            class="col" 
            @dragover.prevent="allowDrop"
            @drop="drop($event, 'column1')"
        >
            <h2>Planned tasks</h2>
            <li 
                class="cards" 
                style="background-color: #e79ba2" 
                v-for="card in column1"
                :key="card.id"
                draggable="true"
                @dragstart="dragStart($event, card, 'column1')" 
                @dragend="dragEnd($event)"
            >
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
            card.edit = new Date().toLocaleString()
        }
    },
})

Vue.component('col2', {
    mixins: [draggableMixin],
    template: `
        <div 
            class="col" 
            @dragover.prevent="allowDrop"
            @drop="drop($event, 'column2')"
        >
            <h2>Tasks in progress</h2>
            <li 
                class="cards" 
                style="background-color: lightblue" 
                v-for="card in column2"
                :key="card.id"
                draggable="true"
                @dragstart="dragStart($event, card, 'column2')" 
                @dragend="dragEnd($event)"
            >
                <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation: {{ card.date }}</li>
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
        column2: {
            type: Array,
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
        }
    }
})

Vue.component('col3', {
    mixins: [draggableMixin],
    template: `
        <div 
            class="col" 
            @dragover.prevent="allowDrop"
            @drop="drop($event, 'column3')"
        >
            <h2>Testing</h2>
            <li 
                class="cards" 
                style="background-color: #f5f287" 
                v-for="card in column3"
                :key="card.id"
                draggable="true"
                @dragstart="dragStart($event, card, 'column3')" 
                @dragend="dragEnd($event)"
            >
                <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation: {{ card.date }}</li>
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
            </li>
        </div>
    `,
    props: {
        column3: {
            type: Array,
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
        }
    }
})

Vue.component('col4', {
    mixins: [draggableMixin],
    template: `
        <div 
            class="col" 
            @dragover.prevent="allowDrop"
            @drop="drop($event, 'column4')"
        >
            <h2>Completed tasks</h2>
            <div 
                class="cards" 
                style="background-color: lightgreen" 
                v-for="card in column4"
                :key="card.id"
                draggable="true"
                @dragstart="dragStart($event, card, 'column4')" 
                @dragend="dragEnd($event)"
            >
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation: {{ card.date }}</li>
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
        }
    },

})

Vue.component('newcard', {
    template: `
    <section>
    <a href="#openModal" class="btn btnModal">Create card</a>
    <div id="openModal" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <a href="#close" title="Close" class="close">×</a>
            <h3 class="modal-title">Fill out the card</h3>
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
                id: Date.now(),
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
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        name: 'Kanban'
    }
})