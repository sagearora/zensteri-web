import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import UserGuard from '../components/UserGuard'
import CheckinScreen from './Checkin/CheckinScreen'
import CheckoutScreen from './Checkout/CheckoutScreen'
import CountListScreen from './Count/CountListScreen'
import CountScreen from './Count/CountScreen'
import DashboardScreen from './Dashboard/DashboardScreen'
import LabelPrintScreen from './LabelPrint/LabelPrintScreen'
import NotFoundScreen from './NotFoundScreen'
import PatientCreateScreen from './Patient/PatientCreateScreen'
import PatientEditScreen from './Patient/PatientEditScreen'
import PatientListScreen from './Patient/PatientListScreen'
import PatientScreen from './Patient/PatientScreen'
import LabelHistoryScreen from './Settings/Label/LabelHistoryScreen'
import OpCreateScreen from './Settings/Op/OpCreateScreen'
import OpEditScreen from './Settings/Op/OpEditScreen'
import OpListScreen from './Settings/Op/OpListScreen'
import SettingsScreen from './Settings/SettingsScreen'
import SteriCreateScreen from './Settings/Steri/SteriCreateScreen'
import SteriEditScreen from './Settings/Steri/SteriEditScreen'
import SteriListScreen from './Settings/Steri/SteriListScreen'
import SteriItemCreateScreen from './Settings/SteriItem/SteriItemCreateScreen'
import SteriItemEditScreen from './Settings/SteriItem/SteriItemEditScreen'
import SteriItemListScreen from './Settings/SteriItem/SteriItemListScreen'
import UserCreateScreen from './Settings/User/UserCreateScreen'
import UserEditScreen from './Settings/User/UserEditScreen'
import UserListScreen from './Settings/User/UserListScreen'
import SteriCycleEditScreen from './SteriCycle/SteriCycleEditScreen'
import SteriCycleListScreen from './SteriCycle/SteriCycleListScreen'
import SteriCycleScreen from './SteriCycle/SteriCycleScreen'
import SteriCycleStartScreen from './SteriCycle/SteriCycleStartScreen'
import TaskEditScreen from './Tasks/TaskEditScreen'
import TaskListScreen from './Tasks/TaskListScreen'
import TaskScreen from './Tasks/TaskScreen'
import ToolsScreen from './Tools/ToolsScreen'
import UploadSteriData from './UploadSteriData/UploadSteriData'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/'>
                        <Route index element={<DashboardScreen />} />
                    </Route>
                    <Route path='/printlabels' element={<LabelPrintScreen />} />
                    <Route path='/logs' element={<LabelPrintScreen />} />
                    <Route path='/checkout' element={<CheckoutScreen />} />
                    <Route path='/checkin' element={<CheckinScreen />} />
                    <Route path='/patients'>
                        <Route path='create' element={<PatientCreateScreen />} />
                        <Route path=':patient_id' element={<PatientScreen />} />
                        <Route path=':patient_id/edit' element={<PatientEditScreen />} />
                        <Route index element={<PatientListScreen />} />
                    </Route>
                    <Route path='/cycles'>
                        <Route path='create' element={<SteriCycleStartScreen />} />
                        <Route path=':cycle_id' element={<SteriCycleScreen />} />
                        <Route path=':cycle_id/edit' element={<SteriCycleEditScreen />} />
                        <Route index element={<SteriCycleListScreen />} />
                    </Route>
                    <Route path='/counts'>
                        <Route path='create' element={<SteriCycleStartScreen />} />
                        <Route path=':count_id' element={<CountScreen />} />
                        <Route path=':count_id/edit' element={<SteriCycleEditScreen />} />
                        <Route index element={<CountListScreen />} />
                    </Route>
                    <Route path='/tasks'>
                        <Route path=':task_id' element={<TaskScreen />} />
                        <Route path=':task_id/edit' element={<TaskEditScreen />} />
                        <Route index element={<TaskListScreen />} />
                    </Route>
                    <Route path='/tools' element={<ToolsScreen />} />
                    <Route path='/upload-steri-data' element={<UploadSteriData />} />
                    <Route path='/settings' element={<UserGuard adminRequired />}>
                        <Route path='users'>
                            <Route path='create' element={<UserCreateScreen />} />
                            <Route path=':user_id/edit' element={<UserEditScreen />} />
                            <Route index element={<UserListScreen />} />
                        </Route>
                        <Route path='ops'>
                            <Route path='create' element={<OpCreateScreen />} />
                            <Route path=':op_id/edit' element={<OpEditScreen />} />
                            <Route index element={<OpListScreen />} />
                        </Route>
                        <Route path='steri'>
                            <Route path='create' element={<SteriCreateScreen />} />
                            <Route path=':steri_id/edit' element={<SteriEditScreen />} />
                            <Route index element={<SteriListScreen />} />
                        </Route>
                        <Route path='steri-items'>
                            <Route path='create' element={<SteriItemCreateScreen />} />
                            <Route path=':item_id/edit' element={<SteriItemEditScreen />} />
                            <Route index element={<SteriItemListScreen />} />
                        </Route>
                        <Route path='labels'>
                            <Route index element={<LabelHistoryScreen />} />
                        </Route>
                        <Route index element={<SettingsScreen />} />
                    </Route>
                    <Route path='*' element={<NotFoundScreen />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter