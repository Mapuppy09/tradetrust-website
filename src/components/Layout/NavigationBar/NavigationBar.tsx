import React, { FunctionComponent } from "react";
import { Settings } from "react-feather";
import { NavigationBar as NavBar, NavigationItem, NAVIGATION_ITEM_TYPE } from "@govtechsg/tradetrust-ui-components";
import { NavLink } from "react-router-dom";
import { URLS } from "../../../constants";

const leftNavItems: NavigationItem[] = [
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
    id: "resources",
    label: "Resources",
    path: "",
    dropdownItems: [
      {
        id: "learn",
        label: "Learn",
        path: "/learn",
        customLink: (
          <NavLink className="block w-full px-4 py-2 font-bold text-cloud-500 hover:text-black" to={"/learn"}>
            Learn
          </NavLink>
        ),
      },
      {
        id: "faq",
        label: "FAQ",
        path: "/faq",
        customLink: (
          <NavLink className="block w-full px-4 py-2 font-bold text-cloud-500 hover:text-black" to={"/faq"}>
            FAQ
          </NavLink>
        ),
      },
    ],
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
    id: "news-events",
    label: "News & Events",
    path: "",
    dropdownItems: [
      {
        id: "news",
        label: "News",
        path: "/news",
        customLink: (
          <NavLink className="block w-full px-4 py-2 font-bold text-cloud-500 hover:text-black" to={"/news"}>
            News
          </NavLink>
        ),
      },
      {
        id: "event",
        label: "Event",
        path: "/event",
        customLink: (
          <NavLink className="block w-full px-4 py-2 font-bold text-cloud-500 hover:text-black " to={"/event"}>
            Event
          </NavLink>
        ),
      },
    ],
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLink,
    id: "contact",
    label: "Contact",
    path: "/contact",
    customLink: (
      <NavLink className="block w-full py-2 text-cloud-500 hover:text-black" to={"/contact"}>
        Contact
      </NavLink>
    ),
  },
];

const rightNavItems: NavigationItem[] = [
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationIconButton,
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    customLink: (
      <NavLink className="block w-full py-2 text-cloud-500 hover:text-black" to={"/settings"}>
        <Settings className="stroke-current" />
      </NavLink>
    ),
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "create-documents",
    label: "Create Doc",
    path: URLS.CREATOR,
    className: "text-cerulean border-cerulean-100 bg-white hover:bg-gray-50 rounded-xl",
  },
  {
    schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
    id: "verify",
    label: "Verify Doc",
    path: "/verify",
    className: "bg-cerulean text-white border-cerulean hover:bg-cerulean-300 hover:border-cerulean-300",
    customLink: (
      <NavLink className="block w-full p-2 shadow-lg text-current hover:text-current rounded-xl" to={"/verify"}>
        Verify Doc
      </NavLink>
    ),
  },
];

const NavLogo = () => {
  return (
    <NavLink to={"/"} data-testid="nav-logo-home">
      <h4 className="text-gray-800">TradeTrust</h4>
    </NavLink>
  );
};

export const NavigationBar: FunctionComponent<{
  toggleNavBar: boolean;
  setToggleNavBar: (toggleNavbar: boolean) => void;
}> = (props) => {
  return (
    <NavBar
      logo={<NavLogo />}
      menuLeft={leftNavItems}
      menuRight={rightNavItems}
      menuMobile={leftNavItems.concat(rightNavItems)}
      setToggleNavBar={props.setToggleNavBar}
      toggleNavBar={props.toggleNavBar}
    />
  );
};
