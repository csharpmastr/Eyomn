import { useSelector } from "react-redux";

const RoloColor = () => {
  const role = useSelector((state) => state.reducer.user.user.role);

  const ColorRoles = {
    titlefColor: {
      0: "text-c-staff",
      1: "text-c-secondary",
      2: "text-c-secondary",
      3: "text-c-primary",
    },

    roleSbColor: {
      0: "xl:bg-sb-org",
      1: "xl:bg-sb-branch",
      2: "xl:bg-bg-sb",
      3: "xl:bg-sb-staff",
    },

    btnHoverColor: {
      0: " xl:hover:bg-hover-org active:bg-pressed-org xl:focus:bg-c-secondary ",
      1: " xl:hover:bg-hover-branch xl:active:bg-pressed-branch xl:focus:bg-c-branch ",
      2: " xl:hover:bg-hover-doctor xl:active:bg-pressed-doctor xl:focus:bg-c-primary ",
      3: " xl:hover:bg-hover-staff xl:active:bg-pressed-staff xl:focus:bg-c-staff ",
    },

    btnBgColor: {
      0: " bg-c-secondary text-f-light font-semibold ",
      1: " bg-c-branch text-f-light font-semibold ",
      2: " bg-c-primary text-f-light font-semibold ",
      3: " bg-c-staff text-f-light font-semibold ",
    },

    graphColor: {
      0: "#264653",
      1: "#4A90E2",
      2: "#1E8282",
      3: "#C79754",
    },

    barColor: {
      0: ["#2A9D8F", "#E9C46A", "#F4A261"],
      1: ["#50A5F7", "#7f995b", "#EF476F"],
      2: ["#2E9C9C", "#F4A896", "#FFC482"],
      3: ["#84B0B0", "#F4A261", "#8ECAE6"],
    },

    btnContentColor: {
      0: " bg-c-secondary ",
      1: " bg-c-branch ",
      2: " bg-c-primary ",
      3: " bg-c-staff ",
    },

    settingBtn: {
      0: " text-c-secondary border border-c-secondary bg-sb-org font-medium ",
      1: " text-c-branch border border-c-branch bg-sb-branch font-medium ",
      2: " text-c-primary border border-c-primary bg-sb-doctor font-medium ",
      3: " text-c-staff border border-c-staff bg-sb-staff font-medium ",
    },

    helpBtn: {
      0: " text-c-secondary border border-c-secondary bg-sb-org font-medium ",
      1: " text-c-branch border border-c-branch bg-sb-branch font-medium ",
      2: " text-c-primary border border-c-primary bg-sb-doctor font-medium ",
      3: " text-c-staff border border-c-staff bg-sb-staff font-medium ",
    },

    helpSection: {
      0: " border-c-secondary text-c-secondary ",
      1: " border-c-branch text-c-branch ",
      2: " border-c-primary text-c-primary ",
      3: " border-c-staff text-c-staff ",
    },
  };

  const roleIndex = parseInt(role, 10);
  const validRoleIndex = isNaN(roleIndex) ? 0 : roleIndex;

  return {
    titlefColor: ColorRoles.titlefColor[validRoleIndex] || "text-f-dark",
    roleSbColor: ColorRoles.roleSbColor[validRoleIndex] || "xl:bg-f-dark",
    btnHoverColor:
      ColorRoles.btnHoverColor[validRoleIndex] || "xl:hover:bg-f-dark",
    btnBgColor:
      ColorRoles.btnBgColor[validRoleIndex] || "bg-f-dark text-f-light",
    graphColor: ColorRoles.graphColor[validRoleIndex] || "#1E8282",
    barColor: ColorRoles.barColor[validRoleIndex] || [
      "#1E8282",
      "#E9C46A",
      "#F4A261",
    ],
    btnContentColor:
      ColorRoles.btnContentColor[validRoleIndex] || "bg-c-primary",
    settingBtn: ColorRoles.settingBtn[validRoleIndex] || "",
    helpBtn: ColorRoles.helpBtn[validRoleIndex] || "",
    helpSection: ColorRoles.helpSection[validRoleIndex] || "",
  };
};

export default RoloColor;
