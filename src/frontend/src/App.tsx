import { BrowserRouter, Routes, Route } from "react-router-dom"
import { I18nProvider } from "@/i18n/context"
import AppLayout from "@/components/layout/AppLayout"
import Menu from "@/pages/Menu"

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Menu />} />
            {/* <Route path="despre-noi" element={<DespreNoi />} />
            <Route path="evenimente" element={<Evenimente />} />
            <Route path="caritate" element={<Caritate />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App