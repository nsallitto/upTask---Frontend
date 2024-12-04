import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import DashboardView from "./views/DashboardView"
import CreateProjectView from "./views/projects/CreateProjectView"
import EditProjectView from "./views/projects/EditProjectView"
import DetailsProjectView from "./views/projects/DetailsProjectView"
import AuthLayout from "./layouts/AuthLayout"
import LoginView from "./views/auth/LoginView"
import RegisterView from "./views/auth/RegisterView"
import ConfirmAccountView from "./views/auth/ConfirmAccountView"
import RequestNewCode from "./views/auth/RequestNewCode"
import ForgotPasswordView from "./views/auth/ForgotPasswordView"
import NewPasswordView from "./views/auth/NewPasswordView"
import ProjectTeamView from "./views/projects/ProjectTeamView"
import ProfileLayout from "./layouts/ProfileLayout"
import ProfileView from "./views/profile/ProfileView"
import ChangePasswordView from "./views/profile/ChangePasswordView"
import NotFound from "./views/404/NotFound"

export default function Router() {
    return (
        <BrowserRouter>
        
            <Routes>
                <Route element={ <AppLayout /> }>
                    <Route path="/" element={ <DashboardView /> } index />
                    <Route path="/projects/create" element={ <CreateProjectView/> } />
                    <Route path="/projects/:projectId" element={ <DetailsProjectView/> } />
                    <Route path="/projects/:projectId/edit" element={ <EditProjectView/> } />
                    <Route path="/projects/:projectId/team" element={ <ProjectTeamView /> } />
                    <Route element={ <ProfileLayout /> }>
                        <Route path="/profile" element={ <ProfileView /> } index />
                        <Route path="/profile/change-password" element={ <ChangePasswordView /> } />
                    </Route>
                </Route>

                <Route element={ <AuthLayout /> } >
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/register" element={<RegisterView />} />
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
                    <Route path="/auth/request-code" element={<RequestNewCode />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/new-password" element={<NewPasswordView />} />
                </Route>

                <Route element={ <AuthLayout /> } >
                    <Route path="*" element={ <NotFound /> } />
                </Route>
                
            </Routes>
        
        </BrowserRouter>
    )
}
