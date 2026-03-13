import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Creates a dropdown section with a heading and select element.
 * @param {string} title The heading text
 * @param {Array<{label: string, value: string}>} options The select options
 * @returns {HTMLElement} The dropdown section container
 */
function createDropdownSection(title, options) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-dropdown-section';

  const heading = document.createElement('p');
  heading.className = 'footer-dropdown-title';
  heading.textContent = title;
  wrapper.append(heading);

  const select = document.createElement('select');
  select.setAttribute('aria-label', title);

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Selecione';
  placeholder.selected = true;
  placeholder.disabled = true;
  select.append(placeholder);

  options.forEach(({ label, value }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    select.append(opt);
  });

  select.addEventListener('change', () => {
    if (select.value) {
      window.open(select.value, '_blank', 'noopener,noreferrer');
      select.selectedIndex = 0;
    }
  });

  wrapper.append(select);
  return wrapper;
}

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  /* --- Inject "Estrutura Organizacional" dropdown into Column 1 (Institucional) --- */
  const firstSection = footer.querySelector('.section:first-child');
  if (firstSection) {
    const columns = firstSection.querySelectorAll(':scope > div');
    const institucionalCol = columns[0];
    if (institucionalCol) {
      institucionalCol.append(createDropdownSection('Estrutura Organizacional', [
        { label: 'Carta de Servi\u00e7os ao Usu\u00e1rio', value: 'https://www.prodesp.sp.gov.br/transparencia/carta-de-servicos-ao-usuario/' },
        { label: 'C\u00f3digo de Conduta e Integridade', value: 'https://www.prodesp.sp.gov.br/institucional/codigo-de-conduta-e-integridade/' },
        { label: 'Estatuto Social', value: 'https://www.prodesp.sp.gov.br/institucional/estatuto-social/' },
        { label: 'Fale Conosco', value: 'https://www.prodesp.sp.gov.br/fale-conosco/' },
        { label: 'Hor\u00e1rio de atendimento, endere\u00e7o e telefone', value: 'https://www.prodesp.sp.gov.br/institucional/horario-de-atendimento/' },
        { label: 'Legisla\u00e7\u00e3o', value: 'https://www.prodesp.sp.gov.br/institucional/legislacao/' },
        { label: 'Lei de Cria\u00e7\u00e3o', value: 'https://www.prodesp.sp.gov.br/institucional/lei-de-criacao/' },
        { label: 'Organograma', value: 'https://www.prodesp.sp.gov.br/institucional/organograma/' },
        { label: 'Perguntas Frequentes', value: 'https://www.prodesp.sp.gov.br/institucional/perguntas-frequentes/' },
        { label: 'Rela\u00e7\u00e3o das Autoridades', value: 'https://www.prodesp.sp.gov.br/institucional/relacao-das-autoridades/' },
      ]));
    }

    /* --- Inject "Governan\u00e7a" dropdown into Column 4 (Transpar\u00eancia) --- */
    const transparenciaCol = columns[3];
    if (transparenciaCol) {
      transparenciaCol.append(createDropdownSection('Governan\u00e7a', [
        { label: 'Aquisi\u00e7\u00e3o de Bens', value: 'https://www.prodesp.sp.gov.br/transparencia/aquisicao-de-bens/' },
        { label: 'Atas das Reuni\u00f5es de Comit\u00ea Estatut\u00e1rio', value: 'https://www.prodesp.sp.gov.br/transparencia/atas-reunioes-comite-estatutario/' },
        { label: 'Atas das Reuni\u00f5es do Comit\u00ea de Elegibilidade', value: 'https://www.prodesp.sp.gov.br/transparencia/atas-reunioes-comite-elegibilidade/' },
        { label: 'Audi\u00eancias/ Consulta P\u00fablica', value: 'https://www.prodesp.sp.gov.br/transparencia/audiencias-consulta-publica/' },
        { label: 'Avalia\u00e7\u00e3o de Metas e Resultados', value: 'https://www.prodesp.sp.gov.br/transparencia/avaliacao-metas-resultados/' },
        { label: 'Avalia\u00e7\u00e3o dos Servi\u00e7os das Empresas Estatais', value: 'https://www.prodesp.sp.gov.br/transparencia/avaliacao-servicos-estatais/' },
        { label: 'Carta Anual de Governan\u00e7a Corporativa', value: 'https://www.prodesp.sp.gov.br/transparencia/carta-anual-governanca/' },
        { label: 'Conv\u00eanios e Instrumentos Cong\u00eaneres', value: 'https://www.prodesp.sp.gov.br/transparencia/convenios-instrumentos-congeneres/' },
        { label: 'Demonstra\u00e7\u00f5es Financeiras', value: 'https://www.prodesp.sp.gov.br/transparencia/demonstracoes-financeiras/' },
        { label: 'Di\u00e1rias e passagens', value: 'https://www.prodesp.sp.gov.br/transparencia/diarias-passagens/' },
        { label: 'Estrat\u00e9gia de Longo Prazo p/ os pr\u00f3ximos 5 anos', value: 'https://www.prodesp.sp.gov.br/transparencia/estrategia-longo-prazo/' },
        { label: 'Informa\u00e7\u00f5es Legadas da Imprensa Oficial', value: 'https://www.prodesp.sp.gov.br/transparencia/informacoes-legadas-imprensa-oficial/' },
        { label: 'Licita\u00e7\u00f5es e Contratos', value: 'https://www.prodesp.sp.gov.br/transparencia/licitacoes-contratos/' },
        { label: 'Plano Anual de Neg\u00f3cio', value: 'https://www.prodesp.sp.gov.br/transparencia/plano-anual-negocio/' },
        { label: 'Pol\u00edticas', value: 'https://www.prodesp.sp.gov.br/transparencia/politicas/' },
        { label: 'Portal de Governan\u00e7a \u2013 Acesso Restrito', value: 'https://www.prodesp.sp.gov.br/transparencia/portal-governanca/' },
        { label: 'Privacidade e Prote\u00e7\u00e3o de Dados \u2014 LGPD', value: 'https://www.prodesp.sp.gov.br/transparencia/lgpd/' },
        { label: 'Regimentos', value: 'https://www.prodesp.sp.gov.br/transparencia/regimentos/' },
        { label: 'Regulamentos', value: 'https://www.prodesp.sp.gov.br/transparencia/regulamentos/' },
        { label: 'Relat\u00f3rio Integrado ou de Sustentabilidade', value: 'https://www.prodesp.sp.gov.br/transparencia/relatorio-integrado-sustentabilidade/' },
        { label: 'Remunera\u00e7\u00e3o de Administradores', value: 'https://www.prodesp.sp.gov.br/transparencia/remuneracao-administradores/' },
      ]));
    }
  }

  block.append(footer);
}
