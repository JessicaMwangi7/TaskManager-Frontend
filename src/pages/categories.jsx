import { Helmet } from "react-helmet";
import CategoryManager from "@/components/dashboard/CategoryManager";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const CategoriesPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Manage Categories | SpendWise</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <CategoryManager />
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
