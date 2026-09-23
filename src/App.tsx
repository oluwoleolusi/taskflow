import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/layout/Shell'
import ToastContainer from './components/ui/ToastContainer'
import AddTaskModal from './components/tasks/AddTaskModal'
import TaskDetailDrawer from './components/tasks/TaskDetailDrawer'
import Today from './pages/Today'
import MyTasks from './pages/MyTasks'
import Upcoming from './pages/Upcoming'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Board from './pages/Board'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <AddTaskModal />
      <TaskDetailDrawer />
      <ToastContainer />
    </>
  )
}
