# Teste automatizado de login e logout no Diário de Enxaqueca
# pylint: disable=attribute-defined-outside-init
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait


class TestDiariodeenxaquecaloginlogout():
    """
    Teste automatizado de login e logout no Diário de Enxaqueca
    Inclui pausas para visualização do teste em execução
    """

    def setup_method(self, _):
        # Configurar Firefox para visualização (não headless)
        options = webdriver.FirefoxOptions()
        options.add_argument("--disable-web-security")
        options.add_argument("--disable-features=VizDisplayCompositor")
        # Para executar em modo headless, descomente a linha abaixo:
        # options.add_argument("--headless")

        self.driver = webdriver.Firefox(options=options)
        self.vars = {}

    def teardown_method(self, _):
        self.driver.quit()

    def test_diariodeenxaquecaloginlogout(self):
        """
        Teste completo de fluxo: abrir página → login → logout
        Com pausas para visualização de cada etapa
        """
        print("=" * 50)
        print("INICIANDO TESTE: Login e Logout")
        print("=" * 50)

        # Etapa 1: Abrir a página inicial
        print("\n1. Abrindo página inicial...")
        self.driver.get("http://localhost:3000/")
        self.driver.set_window_size(1185, 691)
        print("Página inicial carregada")
        time.sleep(3)  # Pausa para visualizar a página inicial

        # Etapa 2: Preencher campo de email
        print("\n2. Preenchendo campo de email...")
        email_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable((By.ID, "email"))
        )
        email_field.click()
        print("Campo de email clicado")
        time.sleep(1)

        email_field.send_keys("zenilda.vieira@uol.com.br")
        print("Email digitado: zenilda.vieira@uol.com.br")
        time.sleep(1)

        # Etapa 3: Preencher campo de senha
        print("\n3. Preenchendo campo de senha...")
        password_field = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable((By.ID, "password"))
        )
        password_field.click()
        print("Campo de senha clicado")
        time.sleep(1)

        password_field.send_keys("12345678")
        print("Senha digitada")
        time.sleep(1)

        # Etapa 4: Clicar no botão de login
        print("\n4. Executando login...")
        login_button = WebDriverWait(self.driver, 10).until(
            expected_conditions.element_to_be_clickable(
                (By.CSS_SELECTOR, ".inline-flex")
            )
        )
        login_button.click()
        print("Botão de login clicado")
        time.sleep(3)  # Pausa para ver o resultado do login

        # Etapa 5: Logout (assumindo que login foi bem-sucedido)
        print("\n5. Executando logout...")
        try:
            # Clicar no menu do usuário
            user_menu = WebDriverWait(self.driver, 10).until(
                expected_conditions.element_to_be_clickable(
                    (By.CSS_SELECTOR, ".text-\\[\\#E74C3C\\]")
                )
            )
            user_menu.click()
            print("Menu do usuário clicado")
            time.sleep(2)

            # Clicar no botão de logout
            logout_button = WebDriverWait(self.driver, 10).until(
                expected_conditions.element_to_be_clickable(
                    (By.CSS_SELECTOR, ".bg-\\[\\#E74C3C\\]")
                )
            )
            logout_button.click()
            print("Botão de logout clicado")
            time.sleep(3)  # Pausa para ver o resultado do logout

            print("\n" + "=" * 50)
            print("TESTE CONCLUÍDO COM SUCESSO!")
            print("=" * 50)

        except Exception as e:
            print(f"\nErro durante logout: {e}")
            # Capturar screenshot em caso de erro
            screenshot_path = "erro_logout.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"Screenshot salvo em: {screenshot_path}")
            raise
