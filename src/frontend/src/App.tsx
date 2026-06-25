import { BrowserRouter, Routes, Route } from "react-router-dom"
import { I18nProvider } from "@/i18n/context"
import { Navbar } from "@/components/layout/Navbar"

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        {/* <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Meniu />} />
            <Route path="despre-noi" element={<DespreNoi />} />
            <Route path="evenimente" element={<Evenimente />} />
            <Route path="caritate" element={<Caritate />} />
          </Route>
        </Routes> */}
        <Navbar />
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App