import { initializeSupabase } from "@/services/supabase";

const supabase = initializeSupabase();

export async function fetchLatestOrders(count: number) {
  const { data, error } = await supabase
    .from("orders_demo")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(count);

  if (error) return console.error("Error fetching latest orders:", error);
  return data;
}

export async function fetchDetailsOfTableNumber(tableNo: number) {
  const { data, error } = await supabase
    .from("orders_demo")
    .select("*")
    .eq("table_no", tableNo)
    .not("status", "eq", "completed"); // ignore completed ones, and later set time for just today

  if (error) return console.error("Error fetching table order:", error);
  return data;
}

export async function fetchOrderDetails(orderId: number) {
  const { data, error } = await supabase
    .from("orders_demo")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) return console.error("Error fetching order by ID:", error);
  return data;
}

export async function setOrderStatus(orderId: number, status: string) {
  const { error } = await supabase
    .from("orders_demo")
    .update({ status: status.trim().toLowerCase() })
    .eq("id", orderId);

  if (error) return console.error("Error updating status:", error);
  return true;
}

export async function fetchOrdersBasedOnStatus(status: string) {
  const { data, error } = await supabase
    .from("orders_demo")
    .select("*")
    .eq("status", status.trim().toLowerCase());

  if (error) return console.error("Error fetching orders by status:", error);
  return data;
}

type ordersSummary = {
  total: number;
  completed: number;
  pending: number;
  rejected: number;
  in_progress: number;
};

type orderStatus =
  | "total"
  | "completed"
  | "pending"
  | "rejected"
  | "in_progress";

export async function fetchOrdersInPeriod(
  days: number
): Promise<ordersSummary> {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const { data, error } = await supabase
    .from("orders_demo")
    .select("status")
    .gte("created_at", sinceDate.toISOString());

  const summary: ordersSummary = {
    total: data ? data.length : 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    in_progress: 0,
  };
  if (error) {
    console.error("Error fetching orders in period:", error);
    return summary;
  }

  data.forEach((order) => {
    const s: orderStatus = order.status || "pending";
    if (summary[s] !== undefined) summary[s]++;
  });

  return summary;
}

export async function toggleOrderTaking(status: string) {
  const isOn = status.trim().toLowerCase() === "on";

  const { error } = await supabase
    .from("vendor_settings")
    .update({ order_taking: isOn })
    .eq("id", 1); // field is not yet added on supabase, will add that later....

  if (error) return console.error("Error toggling order status:", error);
  return true;
}

type menuUpdater = [field: string, itemName: string, value: string];
// too many inconsistencies on this, work on it later....
export async function updateMenu([field, itemName, value]: menuUpdater) {
  const updateObj: Record<string, string | number> = {};
  updateObj[field] = isNaN(parseFloat(value)) ? value : parseFloat(value);

  const { error } = await supabase
    .from("menus")
    .update(updateObj)
    .ilike("name", `%${itemName}%`);

  if (error) return console.error("Error updating menu:", error);
  return true;
}

export function invalidRequest() {
  console.log(" Couldn’t understand that task. Please try again.");
}
