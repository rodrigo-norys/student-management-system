/**
 * Hook responsável por gerenciar as ações de mutação (escrita/alteração) dos usuários.
 * * Ele centraliza:
 * - A lógica de negócio para salvar a edição de um usuário existente (PUT).
 * - A validação e aprovação de novos acessos pendentes (POST).
 * - A atualização do estado local da tabela (dataList) após o sucesso das requisições,
 * garantindo que a interface reflita as mudanças instantaneamente sem precisar recarregar a página.
 */

import axios from 'services/axios';

export default function useUserActions({
  setDataList,
  activeTab,
  setEditingUser,
  setValidatingTarget,
}) {

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(`/users/${id}`, updatedData);

      if (updatedData.is_active !== (activeTab === 'active')) {
        setDataList((prevList) => prevList.filter((user) => user.id !== id));
      } else {
        setDataList((prevList) =>
          prevList.map((user) =>
            user.id === id ? { ...user, ...response.data } : user,
          ),
        );
      }
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.errors?.[0] || 'Server error on saving user.');
    }
  };

  const handleValidateSave = async (
    target,
    accessLevelId,
    email,
    password,
    onErrorCallback,
  ) => {
    try {
      await axios.post('/users', {
        email: email,
        access_level_id: accessLevelId,
        targetId: target.id,
        targetType: target.type,
        password: password,
        is_temporary: true,
      });

      setDataList((prevList) =>
        prevList.filter((item) => item.id !== target.id),
      );
      setValidatingTarget(null);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.errors?.[0] || 'Internal error during validation.';
      onErrorCallback(errorMessage);
    }
  };

  return {
    handleSaveEdit,
    handleValidateSave,
  };
}
