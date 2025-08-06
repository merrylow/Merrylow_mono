import {
  fetchDetailsOfTableNumber,
  fetchLatestOrders,
  fetchOrderDetails,
  fetchOrdersBasedOnStatus,
  fetchOrdersInPeriod,
  setOrderStatus,
  toggleOrderTaking,
  updateMenu,
  invalidRequest,
} from "./vendorTasks";

interface returnType {
  data: string;
  message: string;
}

const performTask = async (task_number: string, args: string[]) => {
  let data = null;
  let message = "";

  switch (task_number) {
    case "1": {
      const count = parseInt(args[0]) || 1;
      data = await fetchLatestOrders(count);

      if (data?.length) {
        const summaries = data.map((order) => {
          const { id, table_no, status, note } = order;
          return `Order #${id} from table ${table_no}, status: ${
            status || "unknown"
          }${note ? `, note: "${note}"` : ""}`;
        });

        message =
          `Fetched the latest ${count} order${count > 1 ? "s" : ""}. ` +
          summaries.join(". ") +
          ".";
      } else {
        message = `No recent orders found.`;
      }
      break;
    }

    case "2": {
      const tableNo = parseInt(args[0]);
      data = await fetchDetailsOfTableNumber(tableNo);

      if (data?.length) {
        const summaries = data.map((order) => {
          const { id, status, note } = order;
          return `Order #${id}, status: ${status || "unknown"}${
            note ? `, note: "${note}"` : ""
          }`;
        });

        message =
          `Fetched ${data.length} active order${
            data.length > 1 ? "s" : ""
          } for table ${tableNo}. ` +
          summaries.join(". ") +
          ".";
      } else {
        message = `No active orders found for table ${tableNo}.`;
      }
      break;
    }

    case "3": {
      const orderId = parseInt(args[0]);
      data = await fetchOrderDetails(orderId);

      if (data) {
        const { id, table_no, status, note } = data;
        message = `Order #${id} is from table ${table_no}, status: ${
          status || "unknown"
        }${note ? `, note: "${note}"` : ""}.`;
      } else {
        message = `No order found with ID ${orderId}.`;
      }
      break;
    }

    case "4": {
      const [orderId, status] = [parseInt(args[0]), args[1]];
      const success = await setOrderStatus(orderId, status);
      data = success;
      message = success
        ? `Order #${orderId} status updated to "${status}".`
        : `Failed to update status for order #${orderId}.`;
      break;
    }

    case "5": {
      const status = args[0];
      data = await fetchOrdersBasedOnStatus(status);

      if (data?.length) {
        const tableList = data
          .map((order) => `table ${order.table_no} (order #${order.id})`)
          .join(", ");
        message =
          `Found ${data.length} ${status} order${
            data.length > 1 ? "s" : ""
          }. ` + `Orders are from: ${tableList}.`;
      } else {
        message = `No orders found with status "${status}".`;
      }
      break;
    }

    case "6": {
      const days = parseInt(args[0]) || 1;
      data = await fetchOrdersInPeriod(days);
      message =
        `Summary for the past ${days} day${days > 1 ? "s" : ""}: ` +
        `Total Orders: ${data.total}, Completed: ${data.completed}, Pending: ${data.pending}, Rejected: ${data.rejected}, In Progress: ${data.in_progress}.`;
      break;
    }

    case "7": {
      const status = args[0];
      const success = await toggleOrderTaking(status);
      data = success;
      message = success
        ? `Order taking has been turned "${status}".`
        : `Failed to update order-taking status.`;
      break;
    }

    case "8": {
      const [field, itemName, value] = args;
      const success = await updateMenu([field, itemName, value]);
      data = success;
      message = success
        ? `Menu item "${itemName}" updated: ${field} → ${value}.`
        : `Failed to update menu item "${itemName}".`;
      break;
    }

    case "99": {
      data = null;
      message = " Couldn't understand the request. Please try rephrasing.";
      invalidRequest();
      break;
    }

    default: {
      data = null;
      message = "Unknown task number.";
      break;
    }
  }

  return { data, message };
};

export default performTask;
