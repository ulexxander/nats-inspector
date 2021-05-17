import { validator } from "./validation";

export const validateIdInput = validator<{ id: number }>({
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
});
