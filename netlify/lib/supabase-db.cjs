const { supabase } = require("./supabase.cjs");

function queryEqual(field, value) {
  return { type: "eq", field, value };
}
function querySearch(field, value) {
  return { type: "ilike", field, value: `%${value}%` }; // Supabase uses ilike for case-insensitive search
}
function queryOrderDesc(field) { return { type: "order", field, ascending: false }; }
function queryOrderAsc(field) { return { type: "order", field, ascending: true }; }
function queryLimit(limit = 25, offset = 0) {
  return { type: "range", from: offset, to: offset + limit - 1 };
}

async function applyQueries(queryBuilder, queries = []) {
  let qb = queryBuilder;
  for (const q of queries) {
    if (q.type === "eq") qb = qb.eq(q.field, q.value);
    else if (q.type === "ilike") qb = qb.ilike(q.field, q.value);
    else if (q.type === "order") qb = qb.order(q.field, { ascending: q.ascending });
    else if (q.type === "range") qb = qb.range(q.from, q.to);
    // Adicionar outros tipos de query conforme necessário
  }
  return qb;
}

async function listDocuments(name, queries = []) {
  let qb = supabase.from(name).select("*");
  qb = await applyQueries(qb, queries);
  const { data, error } = await qb;
  if (error) {
    console.error(`Error listing documents from ${name}:`, error);
    throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
  }
  return { documents: data };
}

async function getDocument(name, id) {
  const { data, error } = await supabase.from(name).select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null; // Not Found
    console.error(`Error getting document ${id} from ${name}:`, error);
    throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
  }
  return data;
}

async function createDocument(name, data) {
  // Supabase auto-gera o UUID para a coluna 'id' se não for fornecido
  const { data: createdData, error } = await supabase.from(name).insert(data).select("*").single();
  if (error) {
    console.error(`Error creating document in ${name}:`, error);
    throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
  }
  return createdData;
}

async function updateDocument(name, id, data) {
  const { data: updatedData, error } = await supabase.from(name).update(data).eq("id", id).select("*").single();
  if (error) {
    console.error(`Error updating document ${id} in ${name}:`, error);
    throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
  }
  return updatedData;
}

async function deleteDocument(name, id) {
  const { error } = await supabase.from(name).delete().eq("id", id);
  if (error) {
    console.error(`Error deleting document ${id} from ${name}:`, error);
    throw Object.assign(new Error(error.message), { code: error.code, status: error.status });
  }
  return { success: true };
}

// Transações: Supabase não tem uma API de transação de alto nível como Appwrite para múltiplas operações em diferentes tabelas.
// Para a migração inicial, as operações serão executadas sequencialmente.
// Para garantir atomicidade em operações críticas, considere usar stored procedures (funções) em PostgreSQL.
async function commitOperations(operations) {
  // Implementação simples: executa cada operação sequencialmente.
  // Em um ambiente de produção, para atomicidade, considere envolver isso em uma função SQL/RPC.
  for (const op of operations) {
    if (op.action === "create") {
      await createDocument(op.databaseId, op.data); // Aqui, databaseId é o nome da tabela
    } else if (op.action === "update") {
      await updateDocument(op.databaseId, op.documentId, op.data);
    } else if (op.action === "delete") {
      await deleteDocument(op.databaseId, op.documentId);
    }
  }
  return { success: true };
}

function transactionCreate(name, id, data) {
  return { action: "create", databaseId: name, documentId: id, data: { id, ...data } };
}
function transactionUpdate(name, id, data) {
  return { action: "update", databaseId: name, documentId: id, data };
}
function transactionDelete(name, id) {
  return { action: "delete", databaseId: name, documentId: id };
}

module.exports = {
  listDocuments, getDocument, createDocument, updateDocument, deleteDocument,
  commitOperations, transactionCreate, transactionUpdate, transactionDelete,
  queryEqual, querySearch, queryOrderDesc, queryOrderAsc, queryLimit,
};
