import ComponentTypes from '@theme-init/NavbarItem/ComponentTypes';
import type {ComponentTypesObject} from '@theme/NavbarItem/ComponentTypes';
import ProjectDropdown from './ProjectDropdown';

// Registers the workshop's own navbar item types next to the stock ones. Docusaurus only accepts
// custom types whose name starts with `custom-` (withWorkshop in shared/index.ts uses them).
export default {
  ...ComponentTypes,
  'custom-projectDropdown': ProjectDropdown,
} as ComponentTypesObject;
