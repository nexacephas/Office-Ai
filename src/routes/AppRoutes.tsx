import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Approvals from '../pages/approvals/Approvals'
import AIChat from '../pages/ai/AIChat'
import Convert from '../pages/ai/Convert'
import Summarize from '../pages/ai/Summarize'
import Write from '../pages/ai/Write'
import Correspondence from '../pages/correspondence/Correspondence'
import DocumentDetails from '../pages/documents/DocumentDetails'
import Documents from '../pages/documents/Documents'
import Dashboard from '../pages/dashboard/Dashboard'
import ForgotPassword from '../pages/auth/ForgotPassword/ForgotPassword'
import Login from '../pages/auth/Login/Login'
import Signup from '../pages/auth/Signup/Signup'
import Intro from '../pages/intro/Intro'
import Knowledge from '../pages/knowledge/Knowledge'
import Meetings from '../pages/meetings/Meetings'
import Notifications from '../pages/notifications/Notifications'
import Registry from '../pages/registry/Registry'
import Settings from '../pages/settings/Settings'
import TaskDetails from '../pages/tasks/TaskDetails'
import Tasks from '../pages/tasks/Tasks'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
            <Route path="ai" element={<AIChat />} />
            <Route path="ai/write" element={<Write />} />
            <Route path="ai/summarize" element={<Summarize />} />
            <Route path="ai/convert" element={<Convert />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:documentId" element={<DocumentDetails />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="registry" element={<Registry />} />
            <Route path="correspondence" element={<Correspondence />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="approvals/:approvalId" element={<Approvals />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="knowledge/:id" element={<Knowledge />} />
            <Route path="settings/*" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}