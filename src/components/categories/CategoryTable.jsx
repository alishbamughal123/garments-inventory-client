import {
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        overflow-hidden
      "
    >
      <table className="w-full">

        <thead>

          <tr className="
            bg-slate-50
            text-slate-600
            text-sm
          ">

            <th className="text-left p-4">
              Category
            </th>

            <th className="text-left p-4">
              Description
            </th>

            <th className="text-center p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {categories?.map(
            (category) => (
              <tr
                key={category.id}
                className="
                  border-t
                  border-slate-100
                  hover:bg-slate-50
                "
              >

                <td className="p-4 font-medium">
                  {category.name}
                </td>

                <td className="p-4 text-slate-500">
                  {
                    category.description
                  }
                </td>

                <td className="p-4">

                  <div className="
                    flex
                    justify-center
                    gap-2
                  ">

                    <button
                      onClick={() =>
                        onEdit(
                          category
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        bg-[var(--color-primary-soft)]
                        text-[var(--color-primary-ink)]
                        hover:bg-[var(--color-primary-muted)]
                      "
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          category.id
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        bg-red-50
                        text-red-600
                        hover:bg-red-100
                      "
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>
    </div>
  );
};

export default CategoryTable;
