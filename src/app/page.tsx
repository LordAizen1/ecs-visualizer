import AppAreaChart from "@/components/AppAreaChart"
import AppBarChart from "@/components/AppBarChart"
import AppPieChart from "@/components/AppPieChart"
import AppRadialChart from "@/components/AppRadialChart"
import CardList from "@/components/CardList"

const HomePage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title={"Latest Transactions"} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg ">
        <AppRadialChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      
      <div className="bg-primary-foreground p-4 rounded-lg ">
        <CardList title={"Popular Content"} />
      </div>
    </div>
  )
}

export default HomePage
