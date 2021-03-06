'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem.bind(this, ));
        this.addToStorage();
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(target.closest('.todo-item'));
            } else if (target.classList.contains('todo-complete')) {
                this.completedItem(target.closest('.todo-item'));
            }
        });
    }

    deleteItem(item) {
        this.todoData.forEach(elem => {
            if (item.key === elem.key) {
                this.todoData.delete(item.key);
                this.render();
            }
        });
    }

    completedItem(item) {
        this.todoData.forEach(elem => {
            if (item.key === elem.key) {
                this.todoData.get(item.key).completed = !this.todoData.get(item.key).completed;
                this.render();
            }
        });
    }

    createItem(item) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = item.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${item.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
        `);
        if (item.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
        } else {
            alert('Нельзя вводить пустое дело!');
        }
        this.input.value = '';
        this.render();
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.render();
    }


}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();