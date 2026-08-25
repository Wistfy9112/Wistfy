/* Frame-loop state shared inside the singleton scene. Module-scoped on
   purpose: React compiler rules forbid mutating prop-borne objects. */

export const SYS_SHARED = {
  hover: { on: false },
};
