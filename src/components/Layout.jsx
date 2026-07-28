import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DRAWER_WIDTH = 250;

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar open={open} drawerWidth={DRAWER_WIDTH} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          minWidth: 0,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Navbar onToggle={() => setOpen((o) => !o)} />
        <Box component="main" sx={{ flex: 1, p: 3, overflowX: "hidden" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import { Box } from "@mui/material";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const DRAWER_WIDTH = 250;

// export default function Layout() {
//   const [open, setOpen] = useState(true);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         minHeight: "100vh",
//         bgcolor: "background.default",
//       }}
//     >
//       <Sidebar open={open} drawerWidth={DRAWER_WIDTH} />

//       <Box
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//           width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%", // ✅ fix
//           minWidth: 0, // ✅ prevent overflow
//           transition: "width 0.3s ease", // ✅ smooth toggle
//           overflow: "hidden",
//         }}
//       >
//         <Navbar onToggle={() => setOpen(!open)} />
//         <Box component="main" sx={{ flex: 1, p: 3, overflowX: "hidden" }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// }
