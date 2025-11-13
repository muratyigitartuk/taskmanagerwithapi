const api = {
  async list() {
    const res = await fetch('/api/tasks')
    const json = await res.json()
    if (!res.ok) throw json
    return json
  },
  async create(payload) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw await res.json()
    return res.json()
  },
  async update(id, payload) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw await res.json()
    return res.json()
  },
  async remove(id) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw await res.json()
  }
}

const tasksEl = document.getElementById('tasks')
const form = document.getElementById('create-form')
const createErrorEl = document.getElementById('create-error')

function renderTask(t) {
  const li = document.createElement('li')
  const meta = document.createElement('div')
  meta.className = 'meta'
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = !!t.completed
  const title = document.createElement('input')
  title.type = 'text'
  title.value = t.title
  const desc = document.createElement('input')
  desc.type = 'text'
  desc.value = t.description || ''
  const due = document.createElement('input')
  due.type = 'date'
  due.value = t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : ''

  meta.append(checkbox, title, desc, due)

  const actions = document.createElement('div')
  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Save'
  const delBtn = document.createElement('button')
  delBtn.textContent = 'Delete'
  actions.append(saveBtn, delBtn)

  li.append(meta, actions)

  checkbox.addEventListener('change', async () => {
    try {
      const { data } = await api.update(t._id, { completed: checkbox.checked })
      t.completed = data.completed
    } catch (e) { console.error(e) }
  })

  saveBtn.addEventListener('click', async () => {
    try {
      const payload = { title: title.value.trim(), description: desc.value.trim(), dueDate: due.value || undefined, completed: checkbox.checked }
      const { data } = await api.update(t._id, payload)
      t = data
    } catch (e) { alert(e?.error?.message || 'Failed to save') }
  })

  delBtn.addEventListener('click', async () => {
    if (!confirm('Delete task?')) return
    try {
      await api.remove(t._id)
      li.remove()
    } catch (e) { console.error(e) }
  })

  return li
}

async function refresh() {
  tasksEl.innerHTML = ''
  try {
    const { data } = await api.list()
    data.forEach(t => tasksEl.appendChild(renderTask(t)))
  } catch (err) {
    const li = document.createElement('li')
    li.textContent = err?.error?.message || 'Failed to load tasks'
    tasksEl.appendChild(li)
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const payload = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    dueDate: document.getElementById('dueDate').value || undefined
  }
  try {
    await api.create(payload)
    createErrorEl.textContent = ''
    form.reset()
    await refresh()
  } catch (err) {
    createErrorEl.textContent = err?.error?.message || 'Validation failed'
  }
})

refresh()
