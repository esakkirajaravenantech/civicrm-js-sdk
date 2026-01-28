/**
 * CiviCRM SDK Type Definitions
 */

// ===== Configuration Types =====

export interface CiviCRMConfig {
  /** Base URL of the CiviCRM installation (e.g., https://example.org) */
  baseUrl: string;
  /** CiviCRM API Key for authentication */
  apiKey: string;
  /** CiviCRM Site Key for authentication */
  siteKey: string;
  /** API version to use: 3 or 4 (default: 4) */
  apiVersion?: 3 | 4;
  /** Custom headers to include in all requests */
  customHeaders?: Record<string, string>;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

export interface TokenParams {
  /** Whether to use token-based authentication */
  useToken: boolean;
  /** Function that returns the token */
  token?: () => string | Promise<string>;
  /** Token type: Bearer or token */
  tokenType?: 'Bearer' | 'token';
}

// ===== API Response Types =====

export interface CiviCRMError {
  httpStatus?: number;
  httpStatusText?: string;
  message: string;
  error_code?: string;
  error_message?: string;
  is_error?: 1;
  exception?: string;
  details?: any;
}

export interface ApiV3Response<T = any> {
  is_error: 0 | 1;
  version: number;
  count: number;
  values: Record<string, T> | T[];
  error_message?: string;
  error_code?: string;
}

export interface ApiV4Response<T = any> {
  values?: T[];
  count?: number;
  countMatched?: number;
  countFetched?: number;
  is_error?: 0 | 1;
  error_message?: string;
  error_code?: string;
}

// ===== Query Types =====

export type WhereClause = [string, string, any] | [string, string, any, any];
export type OrderByClause = [string, 'ASC' | 'DESC'];

export interface GetListParams {
  /** Filter conditions (SQL AND) */
  where?: WhereClause[];
  /** Fields to return */
  select?: string[];
  /** Order by clauses */
  orderBy?: Record<string, 'ASC' | 'DESC'>;
  /** Maximum number of records to return */
  limit?: number;
  /** Number of records to skip */
  offset?: number;
  /** Group by field */
  groupBy?: string[];
  /** Having clause for group by */
  having?: WhereClause[];
  /** Join related entities */
  join?: JoinClause[];
  /** Chain API calls */
  chain?: Record<string, any>;
}

export interface JoinClause {
  entity: string;
  as?: string;
  on?: WhereClause[];
  select?: string[];
}

export interface GetParams {
  /** Fields to return */
  select?: string[];
  /** Additional parameters */
  [key: string]: any;
}

// ===== Entity Types =====

export interface Contact {
  id?: number;
  contact_type?: 'Individual' | 'Organization' | 'Household';
  contact_sub_type?: string;
  display_name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  prefix_id?: number;
  suffix_id?: number;
  formal_title?: string;
  nick_name?: string;
  job_title?: string;
  birth_date?: string;
  gender_id?: number;
  is_deceased?: boolean;
  deceased_date?: string;
  household_name?: string;
  organization_name?: string;
  legal_name?: string;
  sic_code?: string;
  external_identifier?: string;
  image_URL?: string;
  preferred_communication_method?: string;
  preferred_language?: string;
  hash?: string;
  api_key?: string;
  source?: string;
  do_not_email?: boolean;
  do_not_phone?: boolean;
  do_not_mail?: boolean;
  do_not_sms?: boolean;
  do_not_trade?: boolean;
  is_opt_out?: boolean;
  legal_identifier?: string;
  employer_id?: number;
  created_date?: string;
  modified_date?: string;
  [key: string]: any;
}

export interface Email {
  id?: number;
  contact_id?: number;
  location_type_id?: number;
  email?: string;
  is_primary?: boolean | 0 | 1;
  is_billing?: boolean | 0 | 1;
  on_hold?: boolean | 0 | 1;
  is_bulkmail?: boolean | 0 | 1;
  hold_date?: string;
  reset_date?: string;
  signature_text?: string;
  signature_html?: string;
  [key: string]: any;
}

export interface Phone {
  id?: number;
  contact_id?: number;
  location_type_id?: number;
  phone?: string;
  phone_ext?: string;
  phone_type_id?: number;
  is_primary?: boolean | 0 | 1;
  is_billing?: boolean | 0 | 1;
  mobile_provider_id?: number;
  [key: string]: any;
}

export interface Address {
  id?: number;
  contact_id?: number;
  location_type_id?: number;
  is_primary?: boolean | 0 | 1;
  is_billing?: boolean | 0 | 1;
  street_address?: string;
  supplemental_address_1?: string;
  supplemental_address_2?: string;
  supplemental_address_3?: string;
  city?: string;
  postal_code?: string;
  postal_code_suffix?: string;
  country_id?: number;
  state_province_id?: number;
  county_id?: number;
  geo_code_1?: number;
  geo_code_2?: number;
  name?: string;
  master_id?: number;
  [key: string]: any;
}

export interface Membership {
  id?: number;
  contact_id?: number;
  membership_type_id?: number;
  join_date?: string;
  start_date?: string;
  end_date?: string;
  source?: string;
  status_id?: number;
  is_override?: boolean | 0 | 1;
  status_override_end_date?: string;
  owner_membership_id?: number;
  max_related?: number;
  is_test?: boolean | 0 | 1;
  is_pay_later?: boolean | 0 | 1;
  contribution_recur_id?: number;
  campaign_id?: number;
  [key: string]: any;
}

export interface Activity {
  id?: number;
  source_contact_id?: number;
  activity_type_id?: number;
  subject?: string;
  activity_date_time?: string;
  duration?: number;
  location?: string;
  phone_id?: number;
  phone_number?: string;
  details?: string;
  status_id?: number;
  priority_id?: number;
  parent_id?: number;
  is_test?: boolean | 0 | 1;
  medium_id?: number;
  is_auto?: boolean | 0 | 1;
  relationship_id?: number;
  is_current_revision?: boolean | 0 | 1;
  original_id?: number;
  result?: string;
  is_deleted?: boolean | 0 | 1;
  campaign_id?: number;
  engagement_level?: number;
  weight?: number;
  is_star?: boolean | 0 | 1;
  [key: string]: any;
}

export interface Contribution {
  id?: number;
  contact_id?: number;
  financial_type_id?: number;
  contribution_page_id?: number;
  payment_instrument_id?: number;
  receive_date?: string;
  non_deductible_amount?: number;
  total_amount?: number;
  fee_amount?: number;
  net_amount?: number;
  trxn_id?: string;
  invoice_id?: string;
  invoice_number?: string;
  currency?: string;
  cancel_date?: string;
  cancel_reason?: string;
  receipt_date?: string;
  thankyou_date?: string;
  source?: string;
  amount_level?: string;
  contribution_recur_id?: number;
  is_test?: boolean | 0 | 1;
  is_pay_later?: boolean | 0 | 1;
  contribution_status_id?: number;
  address_id?: number;
  check_number?: string;
  campaign_id?: number;
  creditnote_id?: string;
  tax_amount?: number;
  revenue_recognition_date?: string;
  is_template?: boolean | 0 | 1;
  [key: string]: any;
}

export interface Participant {
  id?: number;
  contact_id?: number;
  event_id?: number;
  status_id?: number;
  role_id?: string;
  register_date?: string;
  source?: string;
  fee_level?: string;
  is_test?: boolean | 0 | 1;
  is_pay_later?: boolean | 0 | 1;
  fee_amount?: number;
  registered_by_id?: number;
  discount_id?: number;
  fee_currency?: string;
  campaign_id?: number;
  discount_amount?: number;
  cart_id?: number;
  must_wait?: boolean | 0 | 1;
  transferred_to_contact_id?: number;
  [key: string]: any;
}

export interface Event {
  id?: number;
  title?: string;
  summary?: string;
  description?: string;
  event_type_id?: number;
  participant_listing_id?: number;
  is_public?: boolean | 0 | 1;
  start_date?: string;
  end_date?: string;
  is_online_registration?: boolean | 0 | 1;
  registration_link_text?: string;
  registration_start_date?: string;
  registration_end_date?: string;
  max_participants?: number;
  event_full_text?: string;
  is_monetary?: boolean | 0 | 1;
  financial_type_id?: number;
  payment_processor?: string;
  is_map?: boolean | 0 | 1;
  is_active?: boolean | 0 | 1;
  fee_label?: string;
  is_show_location?: boolean | 0 | 1;
  loc_block_id?: number;
  default_role_id?: number;
  intro_text?: string;
  footer_text?: string;
  confirm_title?: string;
  confirm_text?: string;
  confirm_footer_text?: string;
  is_email_confirm?: boolean | 0 | 1;
  confirm_email_text?: string;
  confirm_from_name?: string;
  confirm_from_email?: string;
  cc_confirm?: string;
  bcc_confirm?: string;
  default_fee_id?: number;
  default_discount_fee_id?: number;
  thankyou_title?: string;
  thankyou_text?: string;
  thankyou_footer_text?: string;
  is_pay_later?: boolean | 0 | 1;
  pay_later_text?: string;
  pay_later_receipt?: string;
  is_partial_payment?: boolean | 0 | 1;
  initial_amount_label?: string;
  initial_amount_help_text?: string;
  min_initial_amount?: number;
  is_multiple_registrations?: boolean | 0 | 1;
  max_additional_participants?: number;
  allow_same_participant_emails?: boolean | 0 | 1;
  has_waitlist?: boolean | 0 | 1;
  requires_approval?: boolean | 0 | 1;
  expiration_time?: number;
  allow_selfcancelxfer?: boolean | 0 | 1;
  selfcancelxfer_time?: number;
  waitlist_text?: string;
  approval_req_text?: string;
  is_template?: boolean | 0 | 1;
  template_title?: string;
  created_id?: number;
  created_date?: string;
  currency?: string;
  campaign_id?: number;
  is_share?: boolean | 0 | 1;
  is_confirm_enabled?: boolean | 0 | 1;
  parent_event_id?: number;
  slot_label_id?: number;
  dedupe_rule_group_id?: number;
  is_billing_required?: boolean | 0 | 1;
  [key: string]: any;
}

export interface Relationship {
  id?: number;
  contact_id_a?: number;
  contact_id_b?: number;
  relationship_type_id?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean | 0 | 1;
  description?: string;
  is_permission_a_b?: boolean | 0 | 1;
  is_permission_b_a?: boolean | 0 | 1;
  case_id?: number;
  [key: string]: any;
}

export interface Note {
  id?: number;
  entity_table?: string;
  entity_id?: number;
  note?: string;
  contact_id?: number;
  modified_date?: string;
  subject?: string;
  privacy?: string;
  [key: string]: any;
}

export interface Group {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  source?: string;
  saved_search_id?: number;
  is_active?: boolean | 0 | 1;
  visibility?: string;
  where_clause?: string;
  select_tables?: string;
  where_tables?: string;
  group_type?: string;
  cache_date?: string;
  refresh_date?: string;
  parents?: string;
  children?: string;
  is_hidden?: boolean | 0 | 1;
  is_reserved?: boolean | 0 | 1;
  created_id?: number;
  modified_id?: number;
  [key: string]: any;
}

export interface Tag {
  id?: number;
  name?: string;
  description?: string;
  parent_id?: number;
  is_selectable?: boolean | 0 | 1;
  is_reserved?: boolean | 0 | 1;
  is_tagset?: boolean | 0 | 1;
  used_for?: string;
  created_id?: number;
  created_date?: string;
  color?: string;
  [key: string]: any;
}

export interface CustomField {
  id?: number;
  custom_group_id?: number;
  name?: string;
  label?: string;
  data_type?: string;
  html_type?: string;
  default_value?: string;
  is_required?: boolean | 0 | 1;
  is_searchable?: boolean | 0 | 1;
  is_search_range?: boolean | 0 | 1;
  weight?: number;
  help_pre?: string;
  help_post?: string;
  mask?: string;
  attributes?: string;
  javascript?: string;
  is_active?: boolean | 0 | 1;
  is_view?: boolean | 0 | 1;
  options_per_line?: number;
  text_length?: number;
  start_date_years?: number;
  end_date_years?: number;
  date_format?: string;
  time_format?: number;
  note_columns?: number;
  note_rows?: number;
  column_name?: string;
  option_group_id?: number;
  serialize?: number;
  filter?: string;
  in_selector?: boolean | 0 | 1;
  [key: string]: any;
}

export interface OptionValue {
  id?: number;
  option_group_id?: number;
  label?: string;
  value?: string;
  name?: string;
  grouping?: string;
  filter?: number;
  is_default?: boolean | 0 | 1;
  weight?: number;
  description?: string;
  is_optgroup?: boolean | 0 | 1;
  is_reserved?: boolean | 0 | 1;
  is_active?: boolean | 0 | 1;
  component_id?: number;
  domain_id?: number;
  visibility_id?: number;
  icon?: string;
  color?: string;
  [key: string]: any;
}

export interface UFMatch {
  id?: number;
  domain_id?: number;
  uf_id?: number;
  uf_name?: string;
  contact_id?: number;
  language?: string;
  [key: string]: any;
}

export interface LineItem {
  id?: number;
  entity_table?: string;
  entity_id?: number;
  contribution_id?: number;
  price_field_id?: number;
  price_field_value_id?: number;
  label?: string;
  qty?: number;
  unit_price?: number;
  line_total?: number;
  participant_count?: number;
  financial_type_id?: number;
  non_deductible_amount?: number;
  tax_amount?: number;
  [key: string]: any;
}

// Generic entity type for dynamic entities
export type AnyEntity = Record<string, any>;
