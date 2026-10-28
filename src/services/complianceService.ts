import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  SupplierVerificationDocument,
  ConsentRecord,
  PrivacyRequest,
  ComplaintCase,
  ComplaintMessage,
  ProductReport,
  ModerationAction,
  TransactionSnapshot,
  AuditEvent,
  ComplianceChecklistItem,
  ComplianceChecklistStatus,
} from '../types';

export const complianceService = {
  // 1. Supplier Verification Documents (Req 1, 4, 34, 35)
  async fetchVerificationDocuments(): Promise<SupplierVerificationDocument[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('supplier_verification_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      supplierId: String(row.supplier_id),
      productId: row.product_id ? String(row.product_id) : undefined,
      category: row.category ? String(row.category) : undefined,
      documentType: row.document_type,
      documentTitle: String(row.document_title || ''),
      documentNumber: row.document_number ? String(row.document_number) : undefined,
      issuedBy: row.issued_by ? String(row.issued_by) : undefined,
      issueDate: row.issue_date ? String(row.issue_date) : undefined,
      expiryDate: row.expiry_date ? String(row.expiry_date) : undefined,
      fileMetadata: row.file_metadata || {},
      status: row.status || 'pending',
      reviewNote: row.review_note ? String(row.review_note) : undefined,
      reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
      reviewedAt: row.reviewed_at ? String(row.reviewed_at) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
    }));
  },

  async createVerificationDocument(doc: SupplierVerificationDocument): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('supplier_verification_documents').insert({
      supplier_id: doc.supplierId,
      product_id: doc.productId || null,
      category: doc.category || null,
      document_type: doc.documentType,
      document_title: doc.documentTitle,
      document_number: doc.documentNumber || null,
      issued_by: doc.issuedBy || null,
      issue_date: doc.issueDate || null,
      expiry_date: doc.expiryDate || null,
      file_metadata: doc.fileMetadata || {},
      status: doc.status,
      created_at: doc.createdAt,
    });
  },

  async updateVerificationDocumentStatus(
    id: string,
    status: 'approved' | 'rejected' | 'expired',
    reviewedBy: string,
    reviewNote?: string
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('supplier_verification_documents')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        review_note: reviewNote || null,
      })
      .eq('id', id);
  },

  // 2. Consent Records (Req 15, 16, 17)
  async fetchConsentRecords(): Promise<ConsentRecord[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('consent_records')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      userId: String(row.user_id),
      purpose: row.purpose,
      isRequired: Boolean(row.is_required),
      accepted: Boolean(row.accepted),
      policyVersion: String(row.policy_version || 'v2026.1'),
      source: String(row.source || 'privacy_center'),
      timestamp: String(row.timestamp || new Date().toISOString()),
      withdrawnAt: row.withdrawn_at ? String(row.withdrawn_at) : undefined,
    }));
  },

  async insertConsentRecord(record: ConsentRecord): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('consent_records').insert({
      user_id: record.userId,
      purpose: record.purpose,
      is_required: record.isRequired,
      accepted: record.accepted,
      policy_version: record.policyVersion,
      source: record.source,
      timestamp: record.timestamp,
      withdrawn_at: record.withdrawnAt || null,
    });
  },

  // 3. Privacy Requests & Account Deletion Workflow (Req 14, 18)
  async fetchPrivacyRequests(): Promise<PrivacyRequest[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('privacy_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      userId: String(row.user_id),
      userName: row.user_name ? String(row.user_name) : undefined,
      requestType: row.request_type,
      deletionStage: row.deletion_stage || undefined,
      status: row.status || 'submitted',
      details: String(row.details || ''),
      retainedCategoriesExplanation: row.retained_categories_explanation
        ? String(row.retained_categories_explanation)
        : undefined,
      adminNote: row.admin_note ? String(row.admin_note) : undefined,
      processedBy: row.processed_by ? String(row.processed_by) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    }));
  },

  async createPrivacyRequest(req: PrivacyRequest): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('privacy_requests').insert({
      user_id: req.userId,
      user_name: req.userName || null,
      request_type: req.requestType,
      deletion_stage: req.deletionStage || null,
      status: req.status,
      details: req.details,
      retained_categories_explanation: req.retainedCategoriesExplanation || null,
      created_at: req.createdAt,
    });
  },

  async updatePrivacyRequest(
    id: string,
    updates: Partial<PrivacyRequest>
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('privacy_requests')
      .update({
        status: updates.status,
        deletion_stage: updates.deletionStage || null,
        retained_categories_explanation: updates.retainedCategoriesExplanation || null,
        admin_note: updates.adminNote || null,
        processed_by: updates.processedBy || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
  },

  // 4. Complaint & Dispute Cases + Messages (Req 8, 9, 10)
  async fetchComplaintCases(): Promise<ComplaintCase[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('complaint_cases')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      userId: String(row.user_id),
      userName: row.user_name ? String(row.user_name) : undefined,
      supplierId: row.supplier_id ? String(row.supplier_id) : undefined,
      supplierName: row.supplier_name ? String(row.supplier_name) : undefined,
      orderId: row.order_id ? String(row.order_id) : undefined,
      roomId: row.room_id ? String(row.room_id) : undefined,
      complaintType: row.complaint_type,
      description: String(row.description || ''),
      evidenceMetadata: Array.isArray(row.evidence_metadata) ? row.evidence_metadata : [],
      status: row.status || 'submitted',
      submittedAt: String(row.submitted_at || new Date().toISOString()),
      acknowledgementDeadline: String(row.acknowledgement_deadline || new Date().toISOString()),
      acknowledgedAt: row.acknowledged_at ? String(row.acknowledged_at) : undefined,
      resolvedAt: row.resolved_at ? String(row.resolved_at) : undefined,
      resolution: row.resolution ? String(row.resolution) : undefined,
      updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    }));
  },

  async createComplaintCase(complaint: ComplaintCase): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('complaint_cases').insert({
      id: complaint.id,
      user_id: complaint.userId,
      user_name: complaint.userName || null,
      supplier_id: complaint.supplierId || null,
      supplier_name: complaint.supplierName || null,
      order_id: complaint.orderId || null,
      room_id: complaint.roomId || null,
      complaint_type: complaint.complaintType,
      description: complaint.description,
      evidence_metadata: complaint.evidenceMetadata || [],
      status: complaint.status,
      submitted_at: complaint.submittedAt,
      acknowledgement_deadline: complaint.acknowledgementDeadline,
    });
  },

  async updateComplaintCase(
    id: string,
    updates: Partial<ComplaintCase>
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('complaint_cases')
      .update({
        status: updates.status,
        acknowledged_at: updates.acknowledgedAt || null,
        resolved_at: updates.resolvedAt || null,
        resolution: updates.resolution || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
  },

  async fetchComplaintMessages(): Promise<ComplaintMessage[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('complaint_messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      complaintId: String(row.complaint_id),
      senderId: String(row.sender_id),
      senderName: String(row.sender_name || ''),
      senderRole: row.sender_role || 'buyer',
      message: String(row.message || ''),
      createdAt: String(row.created_at || new Date().toISOString()),
    }));
  },

  async insertComplaintMessage(msg: ComplaintMessage): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('complaint_messages').insert({
      complaint_id: msg.complaintId,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      message: msg.message,
      created_at: msg.createdAt,
    });
  },

  // 5. Product Safety Reports (Req 26)
  async fetchProductReports(): Promise<ProductReport[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('product_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      productId: String(row.product_id),
      productName: String(row.product_name || ''),
      supplierId: row.supplier_id ? String(row.supplier_id) : undefined,
      roomId: row.room_id ? String(row.room_id) : undefined,
      reporterUserId: String(row.reporter_user_id),
      reason: row.reason,
      description: String(row.description || ''),
      status: row.status || 'open',
      adminActionNote: row.admin_action_note ? String(row.admin_action_note) : undefined,
      reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
      reviewedAt: row.reviewed_at ? String(row.reviewed_at) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
    }));
  },

  async createProductReport(report: ProductReport): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('product_reports').insert({
      product_id: report.productId,
      product_name: report.productName,
      supplier_id: report.supplierId || null,
      room_id: report.roomId || null,
      reporter_user_id: report.reporterUserId,
      reason: report.reason,
      description: report.description,
      status: report.status,
      created_at: report.createdAt,
    });
  },

  async updateProductReport(
    id: string,
    status: ProductReport['status'],
    reviewedBy: string,
    adminActionNote?: string
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('product_reports')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        admin_action_note: adminActionNote || null,
      })
      .eq('id', id);
  },

  // 6. Moderation Actions (Req 11, 27, 28)
  async fetchModerationActions(): Promise<ModerationAction[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('moderation_actions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      targetType: row.target_type,
      targetId: String(row.target_id),
      targetName: row.target_name ? String(row.target_name) : undefined,
      action: row.action,
      reason: String(row.reason || ''),
      actorId: String(row.actor_id),
      actorName: String(row.actor_name || ''),
      createdAt: String(row.created_at || new Date().toISOString()),
    }));
  },

  async insertModerationAction(action: ModerationAction): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('moderation_actions').insert({
      target_type: action.targetType,
      target_id: action.targetId,
      target_name: action.targetName || null,
      action: action.action,
      reason: action.reason,
      actor_id: action.actorId,
      actor_name: action.actorName,
      created_at: action.createdAt,
    });
  },

  // 7. Immutable Transaction Snapshots (Req 6, 37)
  async fetchTransactionSnapshots(): Promise<TransactionSnapshot[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('transaction_snapshots')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      orderId: String(row.order_id),
      userId: String(row.user_id),
      sellerId: String(row.seller_id),
      productSnapshot: row.product_snapshot || {},
      sellerSnapshot: row.seller_snapshot || {},
      quantity: Number(row.quantity || 1),
      unitPrice: Number(row.unit_price || 0),
      discount: Number(row.discount || 0),
      fees: Number(row.fees || 0),
      shipping: Number(row.shipping || 0),
      finalPrice: Number(row.final_price || 0),
      paymentMethod: String(row.payment_method || 'MOMO (Mô phỏng)'),
      pickupMethod: String(row.pickup_method || ''),
      termsVersion: String(row.terms_version || 'v2026.1'),
      sellerPolicyVersion: String(row.seller_policy_version || 'v2026.1'),
      returnPolicyVersion: String(row.return_policy_version || 'v2026.1'),
      privacyVersion: String(row.privacy_version || 'v2026.1'),
      supplierTaxCode: row.supplier_tax_code ? String(row.supplier_tax_code) : undefined,
      invoiceReference: String(row.invoice_reference || ''),
      confirmationEvent: String(row.confirmation_event || 'Tôi xác nhận đặt hàng'),
      timestamp: String(row.timestamp || new Date().toISOString()),
    }));
  },

  async createTransactionSnapshot(snapshot: TransactionSnapshot): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('transaction_snapshots').insert({
      id: snapshot.id,
      order_id: snapshot.orderId,
      user_id: snapshot.userId,
      seller_id: snapshot.sellerId,
      product_snapshot: snapshot.productSnapshot,
      seller_snapshot: snapshot.sellerSnapshot,
      quantity: snapshot.quantity,
      unit_price: snapshot.unitPrice,
      discount: snapshot.discount,
      fees: snapshot.fees,
      shipping: snapshot.shipping,
      final_price: snapshot.finalPrice,
      payment_method: snapshot.paymentMethod,
      pickup_method: snapshot.pickupMethod,
      terms_version: snapshot.termsVersion,
      seller_policy_version: snapshot.sellerPolicyVersion,
      return_policy_version: snapshot.returnPolicyVersion,
      privacy_version: snapshot.privacyVersion,
      supplier_tax_code: snapshot.supplierTaxCode || null,
      invoice_reference: snapshot.invoiceReference,
      confirmation_event: snapshot.confirmationEvent,
      timestamp: snapshot.timestamp,
    });
  },

  // 8. Append-Only Audit Events (Req 7, 30)
  async fetchAuditEvents(): Promise<AuditEvent[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('audit_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      actorId: String(row.actor_id),
      actorName: row.actor_name ? String(row.actor_name) : undefined,
      actorRole: row.actor_role ? String(row.actor_role) : undefined,
      timestamp: String(row.timestamp || new Date().toISOString()),
      recordId: String(row.record_id),
      eventType: row.event_type,
      category: row.category || 'transaction',
      safeMetadata: row.safe_metadata || {},
    }));
  },

  async appendAuditEvent(event: AuditEvent): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('audit_events').insert({
      actor_id: event.actorId,
      actor_name: event.actorName || null,
      actor_role: event.actorRole || null,
      timestamp: event.timestamp,
      record_id: event.recordId,
      event_type: event.eventType,
      category: event.category,
      safe_metadata: event.safeMetadata || {},
    });
  },

  // 9. Internal Compliance Checklist (Req 33)
  async fetchComplianceChecklist(): Promise<ComplianceChecklistItem[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('compliance_checklist')
      .select('*')
      .order('id', { ascending: true });
    if (error || !data) return [];
    return data.map((row: Record<string, any>) => ({
      id: String(row.id),
      itemKey: String(row.item_key),
      title: String(row.title),
      legalBasis: String(row.legal_basis),
      description: String(row.description || ''),
      status: row.status || 'not_reviewed',
      internalNote: row.internal_note ? String(row.internal_note) : undefined,
      updatedBy: row.updated_by ? String(row.updated_by) : undefined,
      updatedAt: String(row.updated_at || new Date().toISOString()),
    }));
  },

  async updateChecklistItem(
    id: string,
    status: ComplianceChecklistStatus,
    updatedBy: string,
    internalNote?: string
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('compliance_checklist')
      .update({
        status,
        internal_note: internalNote || null,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
  },
};
