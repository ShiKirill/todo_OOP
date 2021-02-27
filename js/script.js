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
        this.todoData.forEach(this.createItem.bind(this));
        this.addToStorage();
    }

    editItem(item) {
        item.setAttribute('contenteditable', 'true');
        item.focus();
        item.textContent = item.textContent.trim();
        item.addEventListener('blur', () => {
            this.todoData.forEach(elem => {
                if (item.key === elem.key) {
                    elem.value = item.textContent;
                }
            });
            item.setAttribute('contenteditable', 'false');
            this.render();
        });
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(target.closest('.todo-item'));
            } else if (target.classList.contains('todo-complete')) {
                this.completedItem(target.closest('.todo-item'));
            } else if (target.closest('.todo-edit')) {
                this.editItem(target.closest('.todo-item'));
            }
        });
    }

    deleteAnimation(item, move) {
        let left = item.offsetLeft;
        const anim = () => {
            let idAnim = requestAnimationFrame(anim);
            if (move < left) {
                const iterator = -70;
                left += iterator;
                item.style.left = left + 'px';
            } else {
                cancelAnimationFrame(idAnim);
                this.todoData.delete(item.key);
                this.render();
            }
        };
        anim();
    }

    deleteItem(item) {
        this.todoData.forEach(elem => {
            if (item.key === elem.key) {
                const move = -item.offsetLeft - item.offsetWidth;
                const top = item.offsetTop;
                const left = item.offsetLeft;
                item.style.position = 'absolute';
                item.style.left = left + 'px';
                item.style.top = top + 'px';
                item.style.zIndex = 10;
                this.deleteAnimation(item, move);
            }
        });
    }

    completedAnimation(item, move) {
        let top = item.offsetTop;
        let iterator = 15;
        const anim = () => {
            let idAnim = requestAnimationFrame(anim);
            const handler = () => {
                cancelAnimationFrame(idAnim);
                this.todoData.get(item.key).completed = !this.todoData.get(item.key).completed;
                this.render();
            };
            if (this.todoData.get(item.key).completed) {
                if (move < top) {
                    top -= iterator;
                    item.style.top = top + 'px';
                } else {
                    handler();
                }
            } else {
                if (move > top) {
                    top += iterator;
                    item.style.top = top + 'px';
                } else {
                    handler();
                }
            }

        };
        anim();
    }

    completedItem(item) {
        this.todoData.forEach(elem => {
            if (item.key === elem.key) {
                let move;
                if (!this.todoData.get(item.key).completed) {
                    move = this.todoCompleted.offsetTop + item.offsetHeight / 2;
                } else {
                    move = this.todoList.offsetTop + item.offsetHeight / 2;
                }
                const top = item.offsetTop;
                const left = item.offsetLeft;
                const width = item.offsetWidth;
                item.style.position = 'absolute';
                item.style.left = left + 'px';
                item.style.top = top + 'px';
                item.style.width = width + 'px';
                item.style.zIndex = 10;
                this.completedAnimation(item, move);
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
        <button class="todo-edit"></button>
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