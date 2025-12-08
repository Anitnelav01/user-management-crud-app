import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role, ROLE_HIERARCHY } from "@/types/user";
import { UserFormData } from "@/schemas/userSchema";
import { initialUsers } from "@/data/initialUsers";

interface UserState {
  users: User[];

  addUser: (data: UserFormData) => void;
  updateUser: (id: string, data: UserFormData) => void;
  deleteUser: (id: string) => void;

  getUserById: (id: string) => User | undefined;
  getManagerName: (managerId: string | null) => string;
  getSubordinates: (userId: string) => User[];

  canBeManager: (managerId: string, subordinateRole: Role) => boolean;
  getPossibleManagers: (role: Role, excludeId?: string) => User[];

  reassignSubordinates: (
    oldManagerId: string,
    newManagerId: string | null
  ) => void;

  resetToInitial: () => void;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const userStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,

      addUser: (data) => {
        const newUser: User = {
          ...data,
          id: generateId(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...data } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      },

      getManagerName: (managerId) => {
        if (!managerId) return "-";
        const manager = get().users.find((user) => user.id === managerId);
        return manager?.name ?? "-";
      },

      getSubordinates: (userId) => {
        return get().users.filter((user) => user.managerId === userId);
      },

      canBeManager: (managerId, subordinateRole) => {
        const manager = get().getUserById(managerId);
        if (!manager) return false;
        return ROLE_HIERARCHY[manager.role] > ROLE_HIERARCHY[subordinateRole];
      },

      getPossibleManagers: (role, excludeId) => {
        return get().users.filter((user) => {
          if (user.id === excludeId) return false;
          return ROLE_HIERARCHY[user.role] > ROLE_HIERARCHY[role];
        });
      },

      reassignSubordinates: (oldManagerId, newManagerId) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.managerId === oldManagerId
              ? { ...user, managerId: newManagerId }
              : user
          ),
        }));
      },

      resetToInitial: () => {
        set({ users: initialUsers });
      },
    }),
    {
      name: "users-storage",
    }
  )
);
