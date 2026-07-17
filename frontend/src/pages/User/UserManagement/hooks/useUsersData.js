import { useState, useEffect } from 'react';
import axios from 'services/axios';
import { ITEMS_PER_PAGE } from '../constants.js';
import useDebounce from 'hooks/useDebounce';

/**
 * Hook responsável por gerenciar todo o estado de leitura e exibição da tela de Gerenciamento de Usuários.
 * * Ele centraliza:
 * - O controle das abas (Ativos, Inativos e Pendentes).
 * - A paginação e o estado de carregamento (loading).
 * - O termo de busca atual.
 * - A comunicação com a API (GET) para buscar e atualizar a lista de dados exibida na tabela.
 */

export default function useUsersData() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  const limit = ITEMS_PER_PAGE;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint =
          activeTab === 'pending' ? '/users/search-targets' : '/users';
        const response = await axios.get(endpoint, {
          params: {
            searchTerm: debouncedSearchTerm,
            page: currentPage,
            limit,
            status: activeTab !== 'pending' ? activeTab : undefined,
          },
        });

        const { data: items, totalPages: pages } = response.data ?? {};
        if (items) {
          setDataList(items);
          setTotalPages(pages || 1);
        } else {
          setDataList([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, debouncedSearchTerm, currentPage, limit]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setDataList([]);
    setSearchTerm('');
    setCurrentPage(1);
    setTotalPages(1);
    setActiveTab(tab);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return {
    activeTab,
    searchTerm,
    setSearchTerm,
    dataList,
    setDataList,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    limit,
    handleTabChange,
    handleNextPage,
    handlePreviousPage,
    viewMode,
    setViewMode,
  };
}
