import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface OfferwallCategories {
  banner_img: Generated<string | null>;
  bg_color: Generated<string | null>;
  created_at: Generated<Date | null>;
  fg_color: Generated<string | null>;
  icon: Generated<string | null>;
  id: Generated<number>;
  is_featured: Generated<number>;
  item_count: Generated<number>;
  mapping_for: Generated<string>;
  match_keywords: string;
  match_order: Generated<number>;
  name: string;
  sort_order: Generated<number>;
  updated_at: Generated<Date | null>;
}

export interface OfferwallNetworks {
  api_key: Generated<string | null>;
  app_id: Generated<string | null>;
  categories: Generated<string | null>;
  code: string;
  config_params: Generated<string | null>;
  countries: Generated<string | null>;
  created_at: Generated<Date | null>;
  enabled: Generated<number | null>;
  id: Generated<number>;
  logo: Generated<string | null>;
  name: string;
  postback_key: Generated<string | null>;
  postback_validation_key: Generated<string | null>;
  pub_id: Generated<string | null>;
  type: "surveys" | "tasks";
  updated_at: Generated<Date | null>;
}

export interface OfferwallPostbackLogs {
  created_at: Generated<Date | null>;
  data: string;
  id: Generated<number>;
  message: string;
  network: string;
  payload: string;
  status: Generated<"error" | "pending" | "processed">;
  transaction_id: Generated<string | null>;
  updated_at: Generated<Date | null>;
}

export interface OfferwallTaskGoals {
  cashback: Generated<Decimal>;
  created_at: Generated<Date | null>;
  description: Generated<string | null>;
  id: Generated<number>;
  image: Generated<string | null>;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_goal_id: string;
  network_goal_name: string;
  network_task_id: string;
  revenue: Generated<Decimal>;
  status: Generated<"draft" | "publish" | "trash" | null>;
  task_offer_id: string;
  updated_at: Generated<Date | null>;
}

export interface OfferwallTasks {
  campaign_id: string;
  category_id: number;
  clicks: Generated<number>;
  conversion_rate: Generated<Decimal | null>;
  countries: Generated<string | null>;
  created_at: Generated<Date | null>;
  created_date: Generated<Date | null>;
  daily_cap: Generated<Decimal | null>;
  description: Generated<string | null>;
  devices: Generated<string | null>;
  end_date: Generated<Date | null>;
  goals_count: Generated<number>;
  id: Generated<number>;
  image: Generated<string | null>;
  instructions: Generated<string | null>;
  is_featured: Generated<number>;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_categories: Generated<string | null>;
  network_goals: Generated<string | null>;
  offer_id: string;
  offer_type: Generated<string | null>;
  payout: Generated<Decimal>;
  platforms: Generated<string | null>;
  redemptions: Generated<number>;
  score: Generated<Decimal | null>;
  start_date: Generated<Date | null>;
  status: Generated<"draft" | "publish" | "trash" | null>;
  updated_at: Generated<Date | null>;
  url: string;
}

export interface UserOfferwallSales {
  amount: Decimal;
  created_at: Generated<Date | null>;
  extra_info: Generated<string | null>;
  id: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: Generated<string | null>;
  offer_id: string;
  payout: Decimal;
  status: Generated<"confirmed" | "declined" | "pending">;
  task_name: string;
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  updated_at: Generated<Date | null>;
  user_id: number;
}

export interface UserTbl {
  created_at: Generated<Date | null>;
  email: string;
  facebookId: Generated<string | null>;
  googleId: Generated<string | null>;
  id: Generated<number>;
  is_verified: Generated<number | null>;
  name: string;
  password: Generated<string | null>;
  updated_at: Generated<Date | null>;
}

export interface DB {
  offerwall_categories: OfferwallCategories;
  offerwall_networks: OfferwallNetworks;
  offerwall_postback_logs: OfferwallPostbackLogs;
  offerwall_task_goals: OfferwallTaskGoals;
  offerwall_tasks: OfferwallTasks;
  user_offerwall_sales: UserOfferwallSales;
  user_tbl: UserTbl;
}
